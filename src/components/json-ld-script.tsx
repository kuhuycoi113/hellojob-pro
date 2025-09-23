
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

            const getEnglishQualification = () => {
                if (!job.languageRequirement || !job.languageRequirement.toLowerCase().includes('tiếng anh')) {
                    return undefined;
                }

                const competency: any[] = [];
                let description = '';

                if (job.languageRequirement.includes('TOEIC 900')) description = "TOEIC score of 900 or higher.";
                else if (job.languageRequirement.includes('TOEIC 800')) description = "TOEIC score of 800 or higher.";
                else if (job.languageRequirement.includes('TOEIC 700')) description = "TOEIC score of 700 or higher.";
                else if (job.languageRequirement.includes('TOEIC 600')) description = "TOEIC score of 600 or higher.";
                else if (job.languageRequirement.includes('TOEIC 500')) description = "TOEIC score of 500 or higher.";
                else if (job.languageRequirement.includes('IELTS 7.0')) description = "IELTS score of 7.0 or higher.";
                else if (job.languageRequirement.includes('IELTS 6.0')) description = "IELTS score of 6.0 or higher.";
                else if (job.languageRequirement.includes('IELTS 5.0')) description = "IELTS score of 5.0 or higher.";
                else if (job.languageRequirement.includes('Giao tiếp tốt')) description = "Proficient in conversational English.";
                else if (job.languageRequirement.includes('Giao tiếp cơ bản')) description = "Basic conversational English skills.";
                else return undefined; // No specific requirement matched

                competency.push({
                    "@type": "DefinedTerm",
                    "name": "English Language",
                    "description": description
                });

                if (job.languageRequirement.includes('TOEIC')) {
                    competency.push({
                        "@type": "DefinedTerm",
                        "name": "TOEIC (Test of English for International Communication)",
                        "termCode": "TOEIC",
                        "inDefinedTermSet": "https://www.ets.org/toeic.html"
                    });
                } else if (job.languageRequirement.includes('IELTS')) {
                    competency.push({
                        "@type": "DefinedTerm",
                        "name": "IELTS (International English Language Testing System)",
                        "termCode": "IELTS",
                        "inDefinedTermSet": "https://www.ielts.org/"
                    });
                }
                
                return {
                    "@type": "EducationalOccupationalCredential",
                    "credentialCategory": {
                      "@type": "DefinedTerm",
                      "termCode": "CERTIFICATE",
                      "inDefinedTermSet": "https://o-net.org/data/t2_15_1.html",
                      "name": "Certification"
                    },
                    "competencyRequired": competency
                };
            }

            let qualifications = job.visaDetail || '';
            if (job.ginouExpiryRequirement) {
                qualifications += `. Yêu cầu ứng viên có visa Kỹ năng đặc định với thời hạn còn lại ${job.ginouExpiryRequirement.toLowerCase()}.`;
            }

            const getJobStartDate = () => {
                if (!job.companyArrivalTime) return undefined;
                // Parse "Tháng MM/YYYY"
                const parts = job.companyArrivalTime.match(/(\d+)\/(\d+)/);
                if (parts && parts.length === 3) {
                    const month = parts[1].padStart(2, '0');
                    const year = parts[2];
                    return `${year}-${month}-01`;
                }
                return undefined;
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
                ...(qualifications && !getEnglishQualification() && { "qualifications": qualifications }),
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
                ...(getApplicantLocationRequirements() && { "applicantLocationRequirements": getApplicantLocationRequirements() }),
                ...(getJobStartDate() && { "jobStartDate": getJobStartDate() }),
                ...(getEnglishQualification() && { "educationRequirements": getEnglishQualification() })
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
