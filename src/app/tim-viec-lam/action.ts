'use server';

import { searchDocuments } from "@/lib/elasticsearch";
import { PaginatedResponse } from "@/lib/types";
const CANDIDATES_INDEX = 'hellojobv5-job-crawled';

export async function getJobs(page: number, limit: number = 10): Promise<PaginatedResponse<any>> {
    const minCreatedDate = process.env.NEXT_PUBLIC_CANDIDATE_CREATED_DATE_GTE
        ? parseInt(process.env.NEXT_PUBLIC_CANDIDATE_CREATED_DATE_GTE, 10)
        : 1752426000000;

    const searchQuery = {
        query: {
            bool: {
                must: [
                    // {
                    //     range: {
                    //         createdDate: {
                    //             gte: minCreatedDate,
                    //         },
                    //     },
                    // },
                ],
            },
        },
        sort: [
            { createdDate: { order: 'desc' } }
        ]
    };

    try {
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
        return { docs: [], total: 0, page, limit, totalPages: 0 };
    }
}