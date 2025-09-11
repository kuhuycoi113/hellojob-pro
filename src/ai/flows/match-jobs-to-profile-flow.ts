
'use server';
/**
 * @fileOverview An AI flow to match a candidate profile with suitable jobs.
 * It calculates a match score based on various criteria, prioritizing visa compatibility.
 *
 * - matchJobsToProfile - The main function to handle the job matching process.
 */

import { CandidateProfile } from '@/ai/schemas';
import { Job, jobData } from '@/lib/mock-data';
import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { locations } from '@/lib/location-data';


const MatchResultSchema = z.object({
    job: z.custom<Job>(),
    score: z.number(),
    matchBreakdown: z.record(z.string(), z.number()),
});

type MatchResult = z.infer<typeof MatchResultSchema>;

// Make most fields optional for the matching logic, as a quick-profile won't have all data.
const PartialCandidateProfileSchema = z.custom<Partial<CandidateProfile>>();


export async function matchJobsToProfile(profile: Partial<CandidateProfile>): Promise<MatchResult[]> {
    return matchJobsToProfileFlow(profile);
}

// Weight constants for scoring
const WEIGHTS = {
    VISA_TYPE: 1000,         // Highest priority, acts as a filter
    VISA_DETAIL: 500,        // Very high priority
    INDUSTRY: 50,            // High priority
    LOCATION: 40,            // High priority
    SKILLS: 3,               // Medium priority (per skill)
    EXPERIENCE_INDUSTRY: 20, // Bonus for experience in the same industry
    LANGUAGE: 15,            // Medium priority
    EDUCATION: 10,           // Lower priority
    AGE: 5,                  // Low priority
    GENDER: 5,               // Low priority
};

const matchJobsToProfileFlow = ai.defineFlow(
    {
        name: 'matchJobsToProfileFlow',
        inputSchema: PartialCandidateProfileSchema,
        outputSchema: z.array(MatchResultSchema),
    },
    async (profile) => {
        const matchedJobs: MatchResult[] = [];

        // Helper function to check if a job's location is within the desired region
        const isLocationInRegion = (jobLocation: string, desiredRegion: string): boolean => {
            if (!desiredRegion) return false;
            const regionPrefectures = locations['Nhật Bản'][desiredRegion as keyof typeof locations['Nhật Bản']];
            if (!regionPrefectures) return false;
            return regionPrefectures.some(prefecture => jobLocation.toLowerCase().includes(prefecture.toLowerCase()));
        };
        
        for (const job of jobData) {
            const breakdown: { [key: string]: number } = {};
            let score = 0;

            // 1. Visa Matching (Hard Filter & High Score)
            if (profile.aspirations?.desiredVisaType && job.visaType &&
                !job.visaType.toLowerCase().includes(profile.aspirations.desiredVisaType.toLowerCase())) {
                continue; // Skip if visa types don't match at all
            } else if (profile.aspirations?.desiredVisaType && job.visaType) {
                 score += WEIGHTS.VISA_TYPE; // Add high score for matching visa type
                 breakdown['visaType'] = WEIGHTS.VISA_TYPE;
            }
            
            if (profile.aspirations?.desiredVisaDetail && job.visaDetail &&
                job.visaDetail.toLowerCase() === profile.aspirations.desiredVisaDetail.toLowerCase()) {
                score += WEIGHTS.VISA_DETAIL;
                breakdown['visaDetail'] = WEIGHTS.VISA_DETAIL;
            }

            // 2. Industry Matching
            if (profile.desiredIndustry && job.industry && job.industry.toLowerCase().includes(profile.desiredIndustry.toLowerCase())) {
                score += WEIGHTS.INDUSTRY;
                breakdown['industry'] = WEIGHTS.INDUSTRY;
            }

            // 3. Location Matching (Updated Logic)
            if (profile.aspirations?.desiredLocation && job.workLocation) {
                const desiredLocLower = profile.aspirations.desiredLocation.toLowerCase();
                const jobLocLower = job.workLocation.toLowerCase();
                // Check for exact prefecture match first
                if (jobLocLower.includes(desiredLocLower)) {
                    score += WEIGHTS.LOCATION;
                    breakdown['location'] = WEIGHTS.LOCATION;
                } 
                // Then check if job's prefecture is in the desired region
                else if (isLocationInRegion(job.workLocation, profile.aspirations.desiredLocation)) {
                    score += WEIGHTS.LOCATION; // Same weight for being in the region
                    breakdown['location'] = WEIGHTS.LOCATION;
                }
            }


            // 4. Skills Matching
            let skillMatches = 0;
            if (profile.skills && profile.skills.length > 0) {
                profile.skills.forEach(skill => {
                    const skillRegex = new RegExp(skill.toLowerCase(), 'i');
                    if (skillRegex.test(job.title.toLowerCase()) || skillRegex.test(job.details.description.toLowerCase()) || skillRegex.test(job.details.requirements.toLowerCase())) {
                        skillMatches++;
                    }
                });
            }
            if (skillMatches > 0) {
                 score += skillMatches * WEIGHTS.SKILLS;
                 breakdown['skills'] = skillMatches * WEIGHTS.SKILLS;
            }

            // 5. Experience Matching
            if (profile.experience && profile.experience.length > 0) {
                profile.experience.forEach(exp => {
                    if (exp.company && exp.role && (job.industry.toLowerCase().includes(exp.company.toLowerCase()) || job.title.toLowerCase().includes(exp.role.toLowerCase()))) {
                        score += WEIGHTS.EXPERIENCE_INDUSTRY;
                        breakdown['experience'] = (breakdown['experience'] || 0) + WEIGHTS.EXPERIENCE_INDUSTRY;
                    }
                })
            }

            // 6. Language Matching
            if (profile.personalInfo?.language && job.languageRequirement && job.languageRequirement !== "Không yêu cầu") {
                 const profileLangLevel = parseInt(profile.personalInfo.language.match(/N(\d)/)?.[1] || '0', 10);
                 const jobLangLevel = parseInt(job.languageRequirement.match(/N(\d)/)?.[1] || '0', 10);
                 if(profileLangLevel > 0 && jobLangLevel > 0 && profileLangLevel <= jobLangLevel){
                     score += WEIGHTS.LANGUAGE;
                     breakdown['language'] = WEIGHTS.LANGUAGE;
                 }
            }

            // 7. Gender Matching
            if(job.gender && job.gender !== 'Cả nam và nữ' && profile.personalInfo?.gender && profile.personalInfo.gender !== job.gender){
                 // Hard negative score if gender doesn't match
                 score -= 1000;
            } else {
                score += WEIGHTS.GENDER;
                breakdown['gender'] = WEIGHTS.GENDER;
            }

            // 8. Age Matching
            if (job.ageRequirement && profile.personalInfo?.birthYear) {
                const [minAge, maxAge] = job.ageRequirement.split('-').map(Number);
                const profileAge = new Date().getFullYear() - profile.personalInfo.birthYear;
                if (profileAge >= minAge && profileAge <= maxAge) {
                    score += WEIGHTS.AGE;
                    breakdown['age'] = WEIGHTS.AGE;
                }
            }

             if (score > 0) {
                matchedJobs.push({ job, score, matchBreakdown: breakdown });
             }
        }

        // Sort jobs by score in descending order
        matchedJobs.sort((a, b) => b.score - a.score);

        return matchedJobs.slice(0, 20); // Return top 20 matches
    }
);
