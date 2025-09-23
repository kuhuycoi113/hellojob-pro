
'use client';

import { useState, useEffect } from 'react';
import type { Job } from '@/lib/mock-data';
import type { SearchFilters } from './job-search/search-results';

interface JsonLdScriptProps {
    job?: Job;
    jobList?: Job[];
    pageMetadata?: {
        title: string;
        description: string;
    }
    appliedFilters?: SearchFilters;
}

export const JsonLdScript = ({ job, jobList, pageMetadata, appliedFilters }: JsonLdScriptProps) => {
    const [structuredData, setStructuredData] = useState<string | null>(null);

    useEffect(() => {
        const getJobPostingStructuredData = (job: Job) => {
            const today = new Date();
            const postedDate = new Date(today);
            postedDate.setDate(today.getDate() + job.postedTimeOffset);
            const isoDate = postedDate.toISOString();
        
            const expiryDate = new Date(isoDate);
            expiryDate.setDate(expiryDate.getDate() + 30);
            
            const salary = job.salary.basic ? parseInt(job.salary.basic.replace(/[^0-9]/g, '')) : undefined;

            const combinedDescription = `
                ${job.details.description.replace(/<[^>]*>?/gm, '')}
                Yêu cầu:
                ${job.details.requirements.replace(/<[^>]*>?/gm, '')}
                Quyền lợi:
                ${job.details.benefits.replace(/<[^>]*>?/gm, '')}
            `;

            const data = {
                "@context": "https://schema.org/",
                "@type": "JobPosting",
                "title": job.title,
                "description": combinedDescription,
                "identifier": {
                    "@type": "PropertyValue",
                    "name": "HelloJob ID",
                    "value": job.id
                },
                "datePosted": isoDate,
                "validThrough": expiryDate.toISOString(),
                "employmentType": "FULL_TIME", // Assuming full time, can be made dynamic
                "hiringOrganization": {
                    "@type": "Organization",
                    "name": "HelloJob (Qua công ty phái cử)",
                    "sameAs": "https://vi.hellojob.jp",
                },
                "jobLocation": {
                    "@type": "Place",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": job.workLocation,
                        "addressCountry": "JP"
                    }
                },
                ...(salary && {
                    "baseSalary": {
                        "@type": "MonetaryAmount",
                        "currency": "JPY",
                        "value": {
                            "@type": "QuantitativeValue",
                            "value": salary,
                            "unitText": "MONTH"
                        }
                    }
                })
            };
            return data;
        };
        
        const getItemListStructuredData = (jobs: Job[], metadata: { title: string, description: string }) => {
            return {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": metadata.title,
                "description": metadata.description,
                "numberOfItems": jobs.length,
                "itemListElement": jobs.map((job, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": {
                        "@type": "JobPosting",
                        "url": `https://vi.hellojob.jp/viec-lam/${job.id}`,
                        "title": job.title
                    }
                }))
            };
        };

        if (job) {
             setStructuredData(JSON.stringify(getJobPostingStructuredData(job)));
        } else if (jobList && pageMetadata) {
             setStructuredData(JSON.stringify(getItemListStructuredData(jobList, pageMetadata)));
        }

    }, [job, jobList, pageMetadata, appliedFilters]);

    if (!structuredData) {
        return null;
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: structuredData }}
        />
    );
};
