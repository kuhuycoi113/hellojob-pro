
'use client';

import { useState, useEffect } from 'react';
import type { Job } from '@/lib/mock-data';
import type { SearchFilters } from './search-results';
import { allIndustries } from '@/lib/industry-data';
import { publicFeeLimits, controlledFeeVisas } from '@/lib/mock-data';

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

            const industryData = allIndustries.find(ind => ind.name === job.industry);

            const getApplicantLocationRequirements = () => {
                if (!controlledFeeVisas.includes(job.visaDetail || '')) {
                    return undefined;
                }
                const feeLimit = publicFeeLimits[job.visaDetail as keyof typeof publicFeeLimits];
                let feeValue : number | undefined;
                
                if (job.netFee) feeValue = parseInt(job.netFee);
                else if (job.netFeeNoTicket) feeValue = parseInt(job.netFeeNoTicket);
                else if (job.netFeeWithTuition) feeValue = parseInt(job.netFeeWithTuition);

                if (feeValue === undefined || feeValue > feeLimit) {
                    return undefined;
                }
                
                return {
                    "@type": "LocationFeatureSpecification",
                    "description": `Yêu cầu chi phí dịch vụ cho ứng viên tại Việt Nam: Khoảng ${feeValue.toLocaleString('en-US')} USD.`
                }
            }

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
                ...(job.visaDetail && { "qualifications": job.visaDetail }),
                ...(industryData && {
                    "industry": {
                        "@type": "DefinedTerm",
                        "name": industryData.name,
                        "termCode": industryData.termCode,
                        "inDefinedTermSet": "https://www.naics.com/search/"
                    }
                }),
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
                }),
                ...(getApplicantLocationRequirements() && { "applicantLocationRequirements": getApplicantLocationRequirements() })
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

    