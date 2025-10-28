'use server';

import { searchDocuments } from "@/lib/elasticsearch";
const CANDIDATES_INDEX = 'hellojobv5-job-crawled';


export async function getJobByCode(code: string): Promise<any> {

    try {
        const searchQuery = {
            query: {
                bool: {
                    filter: [
                        {
                            term: {
                                "code.keyword":code,
                            },
                        },
                    ]
                }
            }
        }
        const results = await searchDocuments<any>(CANDIDATES_INDEX, searchQuery, 0, 1);
        const mappedDocs: any[] = results.docs.map(doc => {
            const name = doc.fullName || doc.sender;
            return {
                ...doc,
                id: doc.id,
                source: doc.source, // Fixed: Added back the source field
            }
        });
        if(mappedDocs.length > 0) {
            return mappedDocs[0];
        }

        return null;
    } catch (error: any) {
        console.error("Failed to fetch candidate by Code:", error);
        return null;
    }
}