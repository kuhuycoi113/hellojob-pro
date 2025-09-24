
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

            let combinedDescription = `
                ${job.details.description.replace(/<[^>]*>?/gm, '')}
                Yêu cầu:
                ${job.details.requirements.replace(/<[^>]*>?/gm, '')}
                Quyền lợi:
                ${job.details.benefits.replace(/<[^>]*>?/gm, '')}
            `;

            const additionalInfo = [];
            if (job.interviewLocation) {
                const interviewInfo = job.interviewLocation.toLowerCase().includes('online')
                    ? `<li>Hình thức phỏng vấn: Online.</li>`
                    : `<li>Địa điểm phỏng vấn: ${job.interviewLocation}, Việt Nam.</li>`;
                additionalInfo.push(interviewInfo);
            }

            if (job.interviewRounds) {
                additionalInfo.push(`<li>Số vòng phỏng vấn: ${job.interviewRounds} vòng.</li>`);
            }
            
            // Structured data for special conditions
            const jobBenefits: string[] = [];
            const qualifications: string[] = [];
            const specialCommitments: string[] = [];
            let organizationName = "HelloJob (Qua công ty phái cử)";

            const specialConditionList = job.specialConditions ? job.specialConditions.split(', ') : [];
            specialConditionList.forEach(condition => {
                const lowerCond = condition.toLowerCase();
                if (['lương tốt', 'tăng ca', 'có thưởng', 'dễ cày tiền', 'tăng lương định kỳ', 'hỗ trợ nhà ở', 'hỗ trợ về công ty', 'cặp đôi', 'nhận visa gia đình'].some(term => lowerCond.includes(term))) {
                    jobBenefits.push(condition);
                } else if (['yêu cầu bằng lái', 'lái được máy', 'nhận tuổi cao', 'nhận tiếng yếu', 'nhận trái ngành', 'nhận thiếu giấy', 'nhận visa katsudo', 'không nhận visa katsudo'].some(term => lowerCond.includes(term))) {
                    qualifications.push(condition);
                } else if (['công ty uy tín', 'nghiệp đoàn uy tín', 'shokai uy tín', 'shien uy tín', 'công ty phái cử uy tín', 'công ty tiếp nhận uy tín'].some(term => lowerCond.includes(term))) {
                     organizationName = `${job.recruiter.company} (${condition})`;
                } else if (['tuyển gấp', 'bay nhanh', 'trình cục sớm'].some(term => lowerCond.includes(term))) {
                    specialCommitments.push(condition);
                }
            });
            
             if (job.specialConditions && job.specialConditions.toLowerCase().includes('không yêu cầu kinh nghiệm')) {
                // This is handled by experienceRequirements property, so we don't add it to other arrays.
            }


            if (additionalInfo.length > 0) {
                 combinedDescription += `
                    <strong>Thông tin tuyển dụng bổ sung:</strong>
                    <ul>${additionalInfo.join('')}</ul>
                `;
            }


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

            const getLanguageQualification = (langReq: string) => {
                const isJapanese = langReq.toLowerCase().includes('tiếng nhật') || langReq.startsWith('N') || langReq.startsWith('Kaiwa') || langReq.startsWith('Trình độ');
                const isEnglish = langReq.toLowerCase().includes('tiếng anh') || langReq.startsWith('TOEIC') || langReq.startsWith('IELTS');

                if (!isJapanese && !isEnglish) return undefined;

                const competency: any[] = [];
                let description = '';
                
                if (isJapanese) {
                    if (langReq.includes('JLPT N1')) description = "JLPT N1 or equivalent.";
                    else if (langReq.includes('JLPT N2')) description = "JLPT N2 or equivalent.";
                    else if (langReq.includes('JLPT N3')) description = "JLPT N3 or equivalent.";
                    else if (langReq.includes('JLPT N4')) description = "JLPT N4 or equivalent.";
                    else if (langReq.includes('JLPT N5')) description = "JLPT N5 or equivalent.";
                    else if (langReq.includes('Kaiwa N1')) description = "Conversational Japanese proficiency equivalent to JLPT N1.";
                    else if (langReq.includes('Kaiwa N2')) description = "Conversational Japanese proficiency equivalent to JLPT N2.";
                    else if (langReq.includes('Kaiwa N3')) description = "Conversational Japanese proficiency equivalent to JLPT N3.";
                    else if (langReq.includes('Kaiwa N4')) description = "Conversational Japanese proficiency equivalent to JLPT N4.";
                    else if (langReq.includes('Kaiwa N5')) description = "Conversational Japanese proficiency equivalent to JLPT N5.";
                    else if (langReq.includes('Trình độ tương đương N1')) description = "Japanese language proficiency equivalent to JLPT N1.";
                    else if (langReq.includes('Trình độ tương đương N2')) description = "Japanese language proficiency equivalent to JLPT N2.";
                    else if (langReq.includes('Trình độ tương đương N3')) description = "Japanese language proficiency equivalent to JLPT N3.";
                    else if (langReq.includes('Trình độ tương đương N4')) description = "Japanese language proficiency equivalent to JLPT N4.";
                    else if (langReq.includes('Trình độ tương đương N5')) description = "Japanese language proficiency equivalent to JLPT N5.";
                    else return undefined;

                    competency.push({ "@type": "DefinedTerm", "name": "Japanese Language", "description": description });
                    competency.push({ "@type": "DefinedTerm", "name": "JLPT (Japanese-Language Proficiency Test)", "termCode": "JLPT", "inDefinedTermSet": "https://www.jlpt.jp/" });
                } else if (isEnglish) {
                    if (langReq.includes('TOEIC 900')) description = "TOEIC score of 900 or higher.";
                    else if (langReq.includes('TOEIC 800')) description = "TOEIC score of 800 or higher.";
                    else if (langReq.includes('TOEIC 700')) description = "TOEIC score of 700 or higher.";
                    else if (langReq.includes('TOEIC 600')) description = "TOEIC score of 600 or higher.";
                    else if (langReq.includes('TOEIC 500')) description = "TOEIC score of 500 or higher.";
                    else if (langReq.includes('IELTS 7.0')) description = "IELTS score of 7.0 or higher.";
                    else if (langReq.includes('IELTS 6.0')) description = "IELTS score of 6.0 or higher.";
                    else if (langReq.includes('IELTS 5.0')) description = "IELTS score of 5.0 or higher.";
                    else if (langReq.includes('Giao tiếp tốt')) description = "Proficient in conversational English.";
                    else if (langReq.includes('Giao tiếp cơ bản')) description = "Basic conversational English skills.";
                    else return undefined;

                    competency.push({ "@type": "DefinedTerm", "name": "English Language", "description": description });
                    if (langReq.includes('TOEIC')) {
                        competency.push({ "@type": "DefinedTerm", "name": "TOEIC (Test of English for International Communication)", "termCode": "TOEIC", "inDefinedTermSet": "https://www.ets.org/toeic.html" });
                    } else if (langReq.includes('IELTS')) {
                        competency.push({ "@type": "DefinedTerm", "name": "IELTS (International English Language Testing System)", "termCode": "IELTS", "inDefinedTermSet": "https://www.ielts.org/" });
                    }
                }

                return {
                    "@type": "EducationalOccupationalCredential",
                    "credentialCategory": { "@type": "DefinedTerm", "termCode": "CERTIFICATE", "inDefinedTermSet": "https://o-net.org/data/t2_15_1.html", "name": "Certification" },
                    "competencyRequired": competency
                };
            }

            const fullQualifications = [...qualifications];
            if (job.visaDetail) {
                fullQualifications.push(job.visaDetail);
            }
            if (job.ginouExpiryRequirement) {
                fullQualifications.push(`Yêu cầu ứng viên có visa Kỹ năng đặc định với thời hạn còn lại ${job.ginouExpiryRequirement.toLowerCase()}.`);
            }

            const getJobStartDate = () => {
                if (!job.companyArrivalTime) return undefined;
                const parts = job.companyArrivalTime.match(/(\d+)\/(\d+)/);
                if (parts && parts.length === 3) {
                    const month = parts[1].padStart(2, '0');
                    const year = parts[2];
                    return `${year}-${month}-01`;
                }
                return undefined;
            }
            
            const languageQualification = job.languageRequirement ? getLanguageQualification(job.languageRequirement) : undefined;
            
            const employmentType = ['FULL_TIME'];
            if (job.specialConditions && job.specialConditions.toLowerCase().includes('haken')) {
                employmentType.push('CONTRACTOR');
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
                "employmentType": employmentType,
                "hiringOrganization": {
                    "@type": "Organization",
                    "name": organizationName,
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
                ...(job.specialConditions?.toLowerCase().includes('không yêu cầu kinh nghiệm') && {
                    "experienceRequirements": {
                        "@type": "OccupationalExperienceRequirements",
                        "monthsOfExperience": 0
                    }
                }),
                ...(fullQualifications.length > 0 && { "qualifications": fullQualifications.join('. ') }),
                ...(jobBenefits.length > 0 && { "jobBenefits": jobBenefits.join('. ') }),
                ...(specialCommitments.length > 0 && { "specialCommitments": specialCommitments.join('. ') }),
                ...(job.jobLocationType && { "jobLocationType": job.jobLocationType }),
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
                ...(languageQualification && { "educationRequirements": languageQualification })
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
