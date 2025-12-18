'use server';

import { SearchFilters } from "@/components/job-search/search-results";
import { countDocuments, searchDocuments } from "@/lib/elasticsearch";
import { PaginatedResponse } from "@/lib/types";
import { visaMapping } from "@/lib/visa-data";
import JOBS from '@/lib/jobs.json';
import LANGUAGE_LEVEL from "@/lib/language_level.json";
const CANDIDATES_INDEX = 'hellojobv5-job-crawled';

function createSearchQuery(filter: SearchFilters, sortOption: string | null): any {

    const {
        q, visaDetail, career, workLocation, job, interviewLocation, numberRecruits, netFee, netFeeNoTicket, interviewRounds, interviewDate, interviewDateType,
        basicSalary, realSalary, hourlySalary, annualIncome, annualBonus, gender, experienceRequirement, yearsOfExperience,
        age, height, weight, visionRequirement, tattooRequirement, languageRequirement, educationRequirement, dominantHand,
        otherSkillRequirement, specialConditions, companyArrivalTime, workShift, englishRequirement, suggestionType, showExpired, sortExpiredToEnd,
        hasForm
    } = filter;
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
                    {
                        bool: {
                            "must_not": [
                                { "term": { "isClosed": true } }
                            ]
                        }
                    }
                ],
                must: [],
                should: [],
            },
        }
    };

    if (!!q && q.length > 0) {
        q.split(';').forEach(keyword => {
            searchQuery.query.bool.must.push({
                bool: {
                    should: [{
                        match_phrase: {
                            "aiContent": {
                                "query": keyword.trim(),
                                "slop": 2
                            }
                        }
                    }, {
                        match_phrase: {
                            "baseContent": {
                                "query": keyword.trim(),
                                "slop": 2
                            }
                        }
                    }, {
                        match_phrase: {
                            "matchingContent": {
                                "query": keyword.trim(),
                                "slop": 2
                            }
                        }
                    }, {
                        match_phrase: {
                            "formMarkdownArray.noiDung": {
                                "query": keyword.trim(),
                                "slop": 2
                            }
                        }
                    }],
                    minimum_should_match: 1,
                },
            });
        })
    }
    const sort: any[] = [];
    if (showExpired) {
        if (sortExpiredToEnd) {
            sort.push({
                "_script": {
                    "type": "number",
                    "order": "asc",
                    "script": {
                        "source": `
            def now = new Date().getTime();
            if (doc['expiredDate'].size() == 0) return 0;
            long exp = doc['expiredDate'].value;
            return now > exp ? 1 : 0;
          `
                    }
                }
            });
        }
    } else {
        searchQuery.query.bool.filter.push({
            "range": {
                "expiredDate": {
                    "gte": Date.now(),
                }
            }
        });
    }
    if (hasForm) {
        searchQuery.query.bool.filter.push(
            {
                exists: {
                    field: "formMarkdownArray",
                },
            }
        );
    }
    switch (sortOption) {
        case 'salary_desc': {
            sort.push({
                "_script": {
                    "type": "number",
                    "order": "desc",
                    "script": {
                        "source": `
        if (doc['basicSalary'].size() == 0 || doc['basicSalary'].value == 0) {
          return -1;
        }
        return doc['basicSalary'].value;
      `
                    }
                }
            })
            break;
        }
        case 'salary_asc': {
            sort.push({
                "_script": {
                    "type": "number",
                    "order": "asc",
                    "script": {
                        "source": `
        if (doc['basicSalary'].size() == 0 || doc['basicSalary'].value == 0) {
          return 99999999;
        }
        return doc['basicSalary'].value;
      `
                    }
                }
            })
            break;
        }
        case 'net_salary_desc': {
            sort.push({
                "_script": {
                    "type": "number",
                    "order": "desc",
                    "script": {
                        "source": `
        if (doc['realSalary'].size() == 0 || doc['realSalary'].value == 0) {
          return -1;
        }
        return doc['realSalary'].value;
      `
                    }
                }
            })
            break;
        }
        case 'net_salary_asc': {
            sort.push({
                "_script": {
                    "type": "number",
                    "order": "asc",
                    "script": {
                        "source": `
        if (doc['realSalary'].size() == 0 || doc['realSalary'].value == 0 || doc['fee'].value >20000 || doc['fee'].value <100) {
          return 99999999;
        }
        return doc['realSalary'].value;
      `
                    }
                }
            })
            break;
        }
        case 'fee_desc': {
            sort.push({
                "_script": {
                    "type": "number",
                    "order": "desc",
                    "script": {
                        "source": `
        if (doc['fee'].size() == 0 || doc['fee'].value == 0 || doc['fee'].value >20000 || doc['fee'].value <100) {
          return -1;
        }
        return doc['fee'].value;
      `
                    }
                }
            })
            break;
        }
        case 'fee_asc': {
            sort.push({
                "_script": {
                    "type": "number",
                    "order": "asc",
                    "script": {
                        "source": `
        if (doc['fee'].size() == 0 || doc['fee'].value == 0) {
          return 99999999;
        }
        return doc['fee'].value;
      `
                    }
                }
            })
            break;
        }
        case 'interview_date_asc': {
            sort.push({
                "interviewDay": {
                    "order": "asc",
                    "missing": "_last"
                }
            });
            break;
        }
        case 'interview_date_desc': {
            sort.push({
                "interviewDay": {
                    "order": "desc",
                    "missing": "_last"
                }
            });
            break;
        }
        case 'newest':
        default: {
            // sort.push({ "_score": { "order": "desc" } });
            sort.push({ "postedDate": { "order": "desc" } });
            break;
        }
    }
    searchQuery.sort = sort;
    const conditionFilters = [];
    const conditionMust = [];
    if (!!visaDetail && visaDetail !== "all-details" && visaDetail !== "" && visaDetail !== "all") {
        const visaLabel = visaMapping[visaDetail as keyof typeof visaMapping] ?? visaDetail;
        conditionFilters.push({
            term: {
                "visa.keyword": visaLabel?.replace(', tri thức', ''),
            },
        });
    }
    if (["thực tập sinh 3 năm", "thực tập sinh 1 năm"].includes(visaDetail ?? '')) {
        conditionFilters.push({
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
            should.push({ term: { "filter.job.value.keyword": { "value": job, "boost": 5 } } });
            if (suggestionType !== 'accurate') {
                should.push({
                    prefix: {
                        "filter.job.value.keyword": { "value": `${jobCodeArr[0]}.${jobCodeArr[1]}.${jobCodeArr[2]}.${jobCodeArr[3]}.`, "boost": 3 },
                    },
                });
                should.push({
                    prefix: {
                        "filter.job.value.keyword": {
                            value: `${jobCodeArr[0]}.${jobCodeArr[1]}.${jobCodeArr[2]}.`,
                            "boost": 1
                        }
                    }
                });
            }
            // should.push({ prefix: { "filter.job.value.keyword": `${jobCodeArr[0]}.${jobCodeArr[1]}.` } });
        } else {
            if (!!job) {
                should.push({
                    term: {
                        "career.keyword": {
                            value: jobObj?.label,
                            boost: 1
                        }
                    }
                });
                should.push({
                    term: {
                        "job.keyword": {
                            value: jobObj?.label,
                            boost: 3
                        }
                    }
                });
                // should.push({ match: { career: job } });
                // should.push({ match: { job: job } });
            } else if (!!career) {
                should.push({
                    term: {
                        "career.keyword": {
                            value: career,
                            boost: 1
                        }
                    }
                });
                should.push({
                    term: {
                        "job.keyword": {
                            value: career,
                            boost: 3
                        }
                    }
                });
                // should.push({ match: { career: career } });
                // should.push({ match: { job: career } });
            }
        }
        conditionMust.push({
            bool: {
                should: should,
                minimum_should_match: 1,
            },
        });
    }

    if (!!workLocation && workLocation.length > 0) {
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
        workLocation.forEach((location: string) => {
            if (!!location && location.trim() !== "empty") {
                shouldLocation.push({ match: { workLocation: location.trim() } });
            }
        });
        conditionMust.push({
            bool: {
                should: shouldLocation,
                minimum_should_match: 1,
            },
        });
    }
    if (!!specialConditions && specialConditions.length > 0) {
        conditionFilters.push({
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
            conditionFilters.push({
                bool: {
                    should: shouldClauses,
                    minimum_should_match: 1,
                },
            });
        }
    }
    if (age && age.length === 2) {
        conditionFilters.push({
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
        conditionFilters.push({
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
        const level = LANGUAGE_LEVEL.find(level => level.slug === languageRequirement);
        if (!!level) {
            const levelType = level.type;
            const levels = LANGUAGE_LEVEL.filter(lv => lv.type === levelType && lv.level <= level.level).map(lv => lv.name);
            conditionMust.push({
                terms: {
                    "languageLevel.keyword": levels,
                },
            });
        }
    }
    if (!!netFee && netFee.length > 0) {
        const feeNum = Number(netFee);
        conditionMust.push({
            range: {
                fee: {
                    lte: feeNum,
                    gt: 0
                },
            },
        });
    }
    Object.keys(filter).forEach((key) => {
        // Bỏ qua các trường đặc biệt đã xử lý ở trên
        if (['visa', 'visaDetail', 'workLocation', 'specialConditions', 'career', 'job', 'gender', 'age',
            'interviewDateType', 'q', 'height', 'realSalary', 'basicSalary', 'netFee', 'interviewLocation', 'suggestionType',
            'languageRequirement', 'tattooRequirement', 'weight'].includes(key)) return;

        const value = filter[key as keyof SearchFilters];
        if (value === undefined || value === null || value === '' || value === 'all' || (Array.isArray(value) && value.length === 0)) return;
        if (Array.isArray(value)) {
            conditionFilters.push({
                terms: {
                    [`filter.${key}.keyword`]: value,
                },
            });
        } else if (typeof value === 'string') {
            conditionFilters.push({
                term: {
                    [`filter.${key}.keyword`]: value,
                },
            });
        }
    });
    if (suggestionType === 'related') {
        searchQuery.query.bool.should.push(...conditionFilters);
        searchQuery.query.bool.should.push(...conditionMust);
        searchQuery.query.bool.minimum_should_match = 1;
    } else {
        searchQuery.query.bool.filter.push(...conditionFilters);
        searchQuery.query.bool.must.push(...conditionMust);
    }
    // delete searchQuery.sort
    return searchQuery;
}
export async function getJobs(filter: SearchFilters, sortOption: string | null, page: number, limit: number = 10): Promise<PaginatedResponse<any>> {

    try {
        const query = createSearchQuery(filter, sortOption);
        const results = await searchDocuments<any>(CANDIDATES_INDEX, query, page, limit);
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
            sort: [{
                "_script": {
                    "type": "number",
                    "order": "asc",
                    "script": {
                        "source": `
            def now = new Date().getTime();
            if (doc['expiredDate'].size() == 0) return 0;
            long exp = doc['expiredDate'].value;
            return now > exp ? 1 : 0;
          `
                    }
                }
            },
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
export async function getJobsBySalerID(id: string, page: number, limit: number = 10): Promise<PaginatedResponse<any>> {
    try {
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
                    must: [
                        { term: { "salerID.keyword": id } }
                    ],
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
            return now > exp ? 1 : 0;
          `
                        }
                    }
                },
                { createdDate: { order: 'desc' } }
            ]
        };
        const results = await searchDocuments<any>(CANDIDATES_INDEX, searchQuery, page, limit);
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
        const query = createSearchQuery(filter, null);
        delete query.sort;
        const total = await countDocuments(CANDIDATES_INDEX, query);
        return total;
    } catch (error: any) {
        console.error("Failed to fetch new candidates from Elasticsearch:", error);
        if (error.meta?.body?.error?.type === 'index_not_found_exception') {
            console.log(`Index ${CANDIDATES_INDEX} not found. Returning empty results.`);
        }
        return 0;
    }
}