'use server';

import { searchDocuments, updateDocument } from "@/lib/elasticsearch";
import { PaginatedResponse } from "@/lib/types";
const CANDIDATES_INDEX = 'hellojobv5-job-crawled';
import JOBS from '@/lib/jobs.json';
import * as AWS from "aws-sdk";
import { FileMimeType } from "@/lib/file-mime-type";

export async function getJobByCode(code: string): Promise<any> {

    try {
        const searchQuery = {
            query: {
                bool: {
                    filter: [
                        {
                            bool: {
                                should: [
                                    { term: { "code.keyword": code } },
                                    { term: { "id.keyword": code } }
                                ],
                                minimum_should_match: 1
                            }
                        }
                    ]
                }
            }
        }
        const results = await searchDocuments<any>(CANDIDATES_INDEX, searchQuery, 1, 1);
        const mappedDocs: any[] = results.docs.map(doc => {
            const name = doc.fullName || doc.sender;
            return {
                ...doc,
                id: doc.id,
                source: doc.source, // Fixed: Added back the source field
            }
        });
        if (mappedDocs.length > 0) {
            return mappedDocs[0];
        }

        return null;
    } catch (error: any) {
        console.error("Failed to fetch candidate by Code:", error);
        return null;
    }
}
function createSearchQuery(jobObj: any): any {

    const {
        visaDetail, career, workLocation, job, gender, specialConditions, id
    } = jobObj;
    const now = new Date();
    const fifteenDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const secondsTimestamp = Math.floor(fifteenDaysAgo.getTime() / 1000);
    const searchQuery: any = {
        query: {
            bool: {
                filter: [
                    {
                        bool: {
                            should: [
                                {
                                    range: {
                                        postedDate: {
                                            gte: secondsTimestamp,
                                        },
                                    },
                                },
                                {
                                    terms: {
                                        "source.keyword": ["MANUAL", "PARTNER"],
                                    },
                                },
                            ],
                            minimum_should_match: 1,
                        },
                    },
                    {
                        exists: {
                            field: "visa",
                        },
                    },
                    {
                        exists: {
                            field: "aiContent",
                        },
                    },
                    {
                        exists: {
                            field: "job",
                        },
                    },
                    {
                        exists: {
                            field: "career",
                        },
                    },
                    {
                        term: {
                            "country.keyword": "Nhật Bản",
                        },
                    },
                    {
                        exists: {
                            field: "createdDate",
                        },
                    },
                ],
                must_not: [
                    {
                        term: {
                            "id.keyword": id,
                        },
                    },
                ],
                must: [],
                should: [],
            },
        },
        sort: [
            { "_score": { "order": "desc" } },
            { createdDate: { order: 'desc' } }
        ]
    };
    if (!!visaDetail) {
        searchQuery.query.bool.must.push({
            term: {
                "visa.keyword": visaDetail,
            },
        });
    }
    if (["Thực tập sinh 3 năm", "Thực tập sinh 1 năm"].includes(visaDetail)) {
        searchQuery.query.bool.must.push({
            bool: {
                should: [
                    {
                        range: {
                            interviewDay: {
                                gte: "now",
                                format: "dd/MM/yyyy",
                            },
                        },
                    },
                    {
                        bool: {
                            must_not: {
                                exists: { field: "interviewDay" },
                            },
                        },
                    },
                ],
                minimum_should_match: 1,
            },
        });
    }
    if (!!career || !!job) {
        const jobObj = JOBS.find(j => j.label === job);
        const jobCodeArr = jobObj?.valueArr;
        let should = [];
        if (jobObj && jobCodeArr?.length === 5) {
            should.push({ term: { "filter.job.value.keyword": jobObj?.value } });
            should.push({
                prefix: {
                    "filter.job.value.keyword": `${jobCodeArr[0]}.${jobCodeArr[1]}.${jobCodeArr[2]}.${jobCodeArr[3]}.`,
                },
            });
            should.push({ prefix: { "filter.job.value.keyword": `${jobCodeArr[0]}.${jobCodeArr[1]}.${jobCodeArr[2]}.` } });
            // should.push({ prefix: { "filter.job.value.keyword": `${jobCodeArr[0]}.${jobCodeArr[1]}.` } });
        } else {
            if (!!job) {
                should.push({ term: { "career.keyword": job } });
                should.push({ term: { "job.keyword": job } });
                // should.push({ match: { career: job } });
                // should.push({ match: { job: job } });
            } else if (!!career) {
                should.push({ term: { "career.keyword": career } });
                should.push({ term: { "job.keyword": career } });
                // should.push({ match: { career: career } });
                // should.push({ match: { job: career } });
            }
        }
        searchQuery.query.bool.must.push({
            bool: {
                should: should,
                minimum_should_match: 1,
            },
        });
    }

    if (!!workLocation && workLocation.length > 0) {
        const matchingLocations = workLocation?.split(', ');
        const shouldLocation: any = [
            {
                bool: {
                    must_not: {
                        exists: { field: "workLocation" },
                    },
                },
            },
        ];
        matchingLocations.forEach((location: string) => {
            if (!!location && location.trim() !== "empty") {
                shouldLocation.push({ match: { workLocation: location.trim() } });
            }
        });
        searchQuery.query.bool.must.push({
            bool: {
                should: shouldLocation,
                minimum_should_match: 1,
            },
        });
    }
    if (!!specialConditions && specialConditions.length > 0) {
        searchQuery.query.bool.should.push({
            terms: {
                specialConditions: specialConditions.split(', '),
            },
        });
    }
    if (!!gender && gender.length > 0) {
        let genderValues: string[] = [gender];
        if (gender === "nam") {
            genderValues = ["MALE", "NAM", "BOTH"];
        } else if (gender === "nu") {
            genderValues = ["FEMALE", "NỮ", "NU", "BOTH"];
        }
        let shouldClauses = [];
        if (genderValues.length > 0) {
            shouldClauses.push({ terms: { "gender.keyword": genderValues } });
        }
        shouldClauses.push({
            bool: { must_not: { exists: { field: "gender" } } },
        });
        if (shouldClauses.length > 0) {
            searchQuery.query.bool.must.push({
                bool: {
                    should: shouldClauses,
                    minimum_should_match: 1,
                },
            });
        }
    }
    return searchQuery;
}
export const findSuggestedJobs = async (job: any): Promise<PaginatedResponse<any>> => {
    try {
        const query = createSearchQuery(job);
        const results = await searchDocuments<any>(CANDIDATES_INDEX, query, 1, 4);
        const mappedDocs: any[] = results.docs.map(doc => {
            const name = doc.fullName || doc.sender;
            return {
                ...doc,
                id: doc.id,
                source: doc.source, // Fixed: Added back the source field
            }
        });

        return { ...results, docs: mappedDocs };
    } catch (error: any) {
        console.error("Failed to fetch new candidates from Elasticsearch:", error);
        if (error.meta?.body?.error?.type === 'index_not_found_exception') {
            console.log(`Index ${CANDIDATES_INDEX} not found. Returning empty results.`);
        }
        return { docs: [], total: 0, page: 1, limit: 4, totalPages: 0 };
    }
}
export const updateJob = async (job: any, avatarFile: File | null, formImageFile: File | null) => {
    let avatarRelativePath,formImagePath;
    const s3 = new AWS.S3({ endpoint: process.env.AWS_MEDIA_END_POINT });
    try {
        if (!!avatarFile || !!formImageFile) {
            AWS.config.update({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                signatureVersion: "v4",
            });
        }
        if (!!avatarFile) {
            const buffer = Buffer.from(await avatarFile.arrayBuffer());
            const folderUploadPrefix = `upload/hellojobv5/job-avatar/`;
            let mimeType = avatarFile.type;
            if (!FileMimeType[mimeType]) {
                mimeType = "image/png";
            }
            const filename = job.id + "_" + Date.now() + "." + FileMimeType[mimeType];
            const params: any = {
                Bucket: process.env.AWS_MEDIA_BUCKET_NAME,
                Key: folderUploadPrefix + filename,
                Body: buffer,
                ContentType: avatarFile.type,
                ContentDisposition: "inline",
            };
            await s3.putObject(params).promise();
            avatarRelativePath = folderUploadPrefix + filename;
            const avatarUrl = `https://cdn.hellojob.jp/${folderUploadPrefix + filename}`;
            job.avatar = avatarUrl;
        }
        if (!!formImageFile) {
            const buffer = Buffer.from(await formImageFile.arrayBuffer());
            const folderUploadPrefix = `upload/hellojobv5/job-form/`;
            let mimeType = formImageFile.type;
            if (!FileMimeType[mimeType]) {
                mimeType = "image/png";
            }
            const filename = job.id + "_" + Date.now() + "." + FileMimeType[mimeType];
            const params: any = {
                Bucket: process.env.AWS_MEDIA_BUCKET_NAME,
                Key: folderUploadPrefix + filename,
                Body: buffer,
                ContentType: formImageFile.type,
                ContentDisposition: "inline",
            };
            await s3.putObject(params).promise();
            formImagePath = folderUploadPrefix + filename;
            const avatarUrl = `https://cdn.hellojob.jp/${folderUploadPrefix + filename}`;
            job.formImage = avatarUrl;
        }
        await updateDocument(CANDIDATES_INDEX, job.id, job);
        return true;
    } catch (e) {
        if (!!avatarRelativePath) {
            await s3
                .deleteObject({
                    Key: avatarRelativePath,
                    Bucket: process.env.AWS_MEDIA_BUCKET_NAME ?? "",
                })
                .promise();
        }
        if (!!formImagePath) {
            await s3
                .deleteObject({
                    Key: formImagePath,
                    Bucket: process.env.AWS_MEDIA_BUCKET_NAME ?? "",
                })
                .promise();
        }
    }
    return false;
}