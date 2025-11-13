'use server';

import { SearchFilters } from "@/components/job-search/search-results";
import { countDocuments, searchDocuments } from "@/lib/elasticsearch";
import { PaginatedResponse } from "@/lib/types";
import { visaMapping } from "@/lib/visa-data";
import JOBS from '@/lib/jobs.json';
import LANGUAGE_LEVEL from "@/lib/language_level.json";
const CANDIDATES_INDEX = 'hellojobv5-job-crawled';

function createSearchQuery(filter: SearchFilters): any {

    const {
        q, visaDetail, career, workLocation, job, interviewLocation, numberRecruits, netFee, netFeeNoTicket, interviewRounds, interviewDate, interviewDateType,
        basicSalary, realSalary, hourlySalary, annualIncome, annualBonus, gender, experienceRequirement, yearsOfExperience,
        age, height, weight, visionRequirement, tattooRequirement, languageRequirement, educationRequirement, dominantHand,
        otherSkillRequirement, specialConditions, companyArrivalTime, workShift, englishRequirement, suggestionType
    } = filter;
    const now = new Date();
    const fifteenDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const secondsTimestamp = Math.floor(fifteenDaysAgo.getTime() / 1000);
    const searchQuery: any = {
        query: {
            bool: {
                filter: [
                    {
                        range: {
                            createdDate: {
                                gte: 1762502844446,
                            },
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
                must: [],
                should: [],
            },
        },
        sort: [
            {
                "_script": {
                    "type": "number",
                    "order": "asc",
                    "script": {
                        "source": `
            def now = new Date().getTime();
            if (doc['expiredDate'].size() == 0) return 0;
            long exp = doc['expiredDate'].value;
            // Nếu đã hết hạn thì trả về 1, chưa hết hạn thì 0
            return now > exp ? 1 : 0;
          `
                    }
                }
            },
            { "_score": { "order": "desc" } },
            { "createdDate": { "order": "desc" } }
        ]
    };
    const conditions = [];
    if (!!visaDetail && visaDetail !== "all-details" && visaDetail !== "") {
        console.log(visaDetail)
        const visaLabel = visaMapping[visaDetail as keyof typeof visaMapping] ?? visaDetail;
        conditions.push({
            term: {
                "visa.keyword": visaLabel,
            },
        });
    }
    if (["thực tập sinh 3 năm", "thực tập sinh 1 năm"].includes(visaDetail ?? '')) {
        conditions.push({
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
    if ((!!career && career !== 'all') || (!!job && job !== 'all-details')) {
        const jobObj = JOBS.find(j => j.value === job);
        const jobCodeArr = jobObj?.valueArr;
        let should = [];
        if (jobCodeArr?.length === 5) {
            should.push({ term: { "filter.job.value.keyword": job } });
            if (suggestionType !== 'accurate') {
                should.push({
                    prefix: {
                        "filter.job.value.keyword": `${jobCodeArr[0]}.${jobCodeArr[1]}.${jobCodeArr[2]}.${jobCodeArr[3]}.`,
                    },
                });
                should.push({ prefix: { "filter.job.value.keyword": `${jobCodeArr[0]}.${jobCodeArr[1]}.${jobCodeArr[2]}.` } });
            }
            // should.push({ prefix: { "filter.job.value.keyword": `${jobCodeArr[0]}.${jobCodeArr[1]}.` } });
        } else {
            if (!!job) {
                should.push({ term: { "career.keyword": jobObj?.label } });
                should.push({ term: { "job.keyword": jobObj?.label } });
                // should.push({ match: { career: job } });
                // should.push({ match: { job: job } });
            } else if (!!career) {
                should.push({ term: { "career.keyword": career } });
                should.push({ term: { "job.keyword": career } });
                // should.push({ match: { career: career } });
                // should.push({ match: { job: career } });
            }
        }
        conditions.push({
            bool: {
                should: should,
                minimum_should_match: 1,
            },
        });
    }

    if (!!workLocation && workLocation.length > 0) {
        const matchingLocations = Object.assign([], workLocation);
        // workLocation.forEach((location: string) => {
        //     const locationLower = location.toLowerCase();
        //     const province = PROVINCES.find((item) => item.label.toLowerCase() === locationLower && item.level > 0);
        //     if (!!province) {
        //         const parentCode = province.parentCode;
        //         const parentRegion = PROVINCES?.find((item) => item.value === parentCode)?.label;
        //         if (!!parentRegion && matchingLocations.indexOf(parentRegion) === -1) {
        //             matchingLocations.push(parentRegion);
        //         }
        //     }
        // });
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
        conditions.push({
            bool: {
                should: shouldLocation,
                minimum_should_match: 1,
            },
        });
    }
    if (!!specialConditions && specialConditions.length > 0) {
        conditions.push({
            terms: {
                specialConditions: specialConditions,
            },
        });
    }
    if (!!gender && gender.length > 0) {
        let genderValues: string[] = [];
        if (gender === "nam") {
            genderValues = ["MALE", "NAM", "BOTH"];
        } else if (gender === "nu") {
            genderValues = ["FEMALE", "NỮ", "NU", "BOTH"];
        }
        let shouldClauses = [];
        if (genderValues.length > 0) {
            shouldClauses.push({ terms: { "gender.keyword": genderValues } });
        }
        // shouldClauses.push({
        //     bool: { must_not: { exists: { field: "gender" } } },
        // });
        if (shouldClauses.length > 0) {
            conditions.push({
                bool: {
                    should: shouldClauses,
                    minimum_should_match: 1,
                },
            });
        }
    }
    if (age && age.length === 2) {
        conditions.push({
            bool: {
                should: [{
                    range: {
                        "filter.minAge": {
                            lte: age[0],
                        },
                    },
                }, {
                    bool: {
                        must_not: {
                            exists: { field: "filter.minAge" },
                        },
                    },
                }],
                minimum_should_match: 1,
            },
        });
        conditions.push({
            bool: {
                should: [{
                    range: {
                        "filter.maxAge": {
                            lte: age[1],
                        },
                    },
                }, {
                    bool: {
                        must_not: {
                            exists: { field: "filter.maxAge" },
                        },
                    },
                }],
                minimum_should_match: 1,
            },
        });
    }
    if (!!languageRequirement && languageRequirement.length > 0) {
        const level = LANGUAGE_LEVEL.find(level => level.label === languageRequirement.replaceAll('-', ' ').toUpperCase());
        console.log(level)
        if (!!level) {
            const levelType = level.type;
            const levels = LANGUAGE_LEVEL.filter(lv => lv.type === levelType && lv.level <= level.level).map(lv => lv.label);
            conditions.push({
                terms: {
                    "languageLevel.keyword": levels,
                },
            });
        }
    }
    Object.keys(filter).forEach((key) => {
        // Bỏ qua các trường đặc biệt đã xử lý ở trên
        if (['visa', 'visaDetail', 'workLocation', 'specialConditions', 'career', 'job', 'gender', 'age',
            'interviewDateType', 'q', 'height', 'realSalary', 'basicSalary', 'fee', 'interviewLocation', 'suggestionType',
            'languageRequirement', 'tattooRequirement', 'weight'].includes(key)) return;

        const value = filter[key as keyof SearchFilters];
        if (value === undefined || value === null || value === '' || value === 'all' || (Array.isArray(value) && value.length === 0)) return;
        if (Array.isArray(value)) {
            conditions.push({
                terms: {
                    [`filter.${key}.keyword`]: value,
                },
            });
        } else if (typeof value === 'string') {
            conditions.push({
                term: {
                    [`filter.${key}.keyword`]: value,
                },
            });
        }
    });
    if (suggestionType === 'related') {
        searchQuery.query.bool.should = conditions;
        searchQuery.query.bool.minimum_should_match = 1;
    } else {
        searchQuery.query.bool.must = conditions;
    }
    delete searchQuery.sort
    console.log(JSON.stringify(searchQuery));
    return searchQuery;
}
export async function getJobs(filter: SearchFilters, page: number, limit: number = 10): Promise<PaginatedResponse<any>> {

    try {
        const query = createSearchQuery(filter);
        const results = await searchDocuments<any>(CANDIDATES_INDEX, query, page, limit);
        const mappedDocs: any[] = results.docs.map(doc => {
            const name = doc.fullName || doc.sender;
            return {
                ...doc,
                id: doc.id,
                source: doc.source, // Fixed: Added back the source field
            }
        });

        console.log('fetched')
        return { ...results, docs: mappedDocs };
    } catch (error: any) {
        console.error("Failed to fetch new candidates from Elasticsearch:", error);
        if (error.meta?.body?.error?.type === 'index_not_found_exception') {
            console.log(`Index ${CANDIDATES_INDEX} not found. Returning empty results.`);
        }
        return { docs: [], total: 0, page, limit, totalPages: 0 };
    }
}
export async function getJobsByIDs(ids: string[]): Promise<PaginatedResponse<any>> {

    try {
        const query = {
            query: {
                bool: {
                    must: [
                        { terms: { "id.keyword": ids } }
                    ]
                }
            },
            sort: [
                { createdDate: { order: 'desc' } }
            ]
        };
        const results = await searchDocuments<any>(CANDIDATES_INDEX, query, 1, 10);
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
        return { docs: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }
}
export async function countJobs(filter: SearchFilters): Promise<number> {
    try {
        const query = createSearchQuery(filter);
        delete query.sort;
        const total = await countDocuments(CANDIDATES_INDEX, query);
        console.log('counted')
        return total;
    } catch (error: any) {
        console.error("Failed to fetch new candidates from Elasticsearch:", error);
        if (error.meta?.body?.error?.type === 'index_not_found_exception') {
            console.log(`Index ${CANDIDATES_INDEX} not found. Returning empty results.`);
        }
        return 0;
    }
}