
'use server';
/**
 * @fileOverview An AI flow to match a candidate profile with suitable jobs.
 * It calculates a match score based on various criteria, prioritizing visa compatibility,
 * user-declared aspirations, and observed user behavior.
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
    reason: z.string().optional(),
});

type MatchResult = z.infer<typeof MatchResultSchema>;

// Make most fields optional for the matching logic, as a quick-profile won't have all data.
const PartialCandidateProfileSchema = z.custom<Partial<CandidateProfile>>();
const BehavioralSignalSchema = z.custom<Partial<Job>>();


const MatchInputSchema = z.object({
    profile: PartialCandidateProfileSchema,
    suggestionType: z.enum(['accurate', 'related']).optional().default('related'),
    behavioralSignals: z.array(BehavioralSignalSchema).optional(),
});
type MatchInput = z.infer<typeof MatchInputSchema>;


export async function matchJobsToProfile(profile: Partial<CandidateProfile>, suggestionType?: 'accurate' | 'related', behavioralSignals?: Partial<Job>[]): Promise<MatchResult[]> {
    return matchJobsToProfileFlow({ profile, suggestionType, behavioralSignals });
}

// Weight constants for scoring
const WEIGHTS = {
    VISA_TYPE: 1000,
    VISA_DETAIL: 500,
    INDUSTRY: 50,
    LOCATION: 40,
    SKILLS: 3,
    EXPERIENCE_INDUSTRY: 20,
    LANGUAGE: 15,
    EDUCATION: 10,
    AGE: 5,
    GENDER: 5,
    BEHAVIOR: 70, // Weight for behavioral signals
};

const matchJobsToProfileFlow = ai.defineFlow(
    {
        name: 'matchJobsToProfileFlow',
        inputSchema: MatchInputSchema,
        outputSchema: z.array(MatchResultSchema),
    },
    async ({ profile, suggestionType, behavioralSignals }) => {
        const matchedJobs: MatchResult[] = [];
        const isAccurateMode = suggestionType === 'accurate';

        // --- Start of CANHANHOA01 AI analysis ---
        let behaviorAnalysis: { preferredIndustries?: string[], preferredLocations?: string[], preferredVisaTypes?: string[] } = {};
        if (behavioralSignals && behavioralSignals.length > 0) {
            // Aggregate signals
            const industryCounts: { [key: string]: number } = {};
            const locationCounts: { [key: string]: number } = {};
            const visaCounts: { [key: string]: number } = {};

            for (const signal of behavioralSignals) {
                if (signal.industry) industryCounts[signal.industry] = (industryCounts[signal.industry] || 0) + 1;
                if (signal.workLocation) locationCounts[signal.workLocation] = (locationCounts[signal.workLocation] || 0) + 1;
                if (signal.visaDetail) visaCounts[signal.visaDetail] = (visaCounts[signal.visaDetail] || 0) + 1;
            }

            // Simple "AI" logic: take the top 2 most frequent items as preferred
            behaviorAnalysis = {
                preferredIndustries: Object.entries(industryCounts).sort((a, b) => b[1] - a[1]).slice(0, 2).map(e => e[0]),
                preferredLocations: Object.entries(locationCounts).sort((a, b) => b[1] - a[1]).slice(0, 2).map(e => e[0]),
                preferredVisaTypes: Object.entries(visaCounts).sort((a, b) => b[1] - a[1]).slice(0, 2).map(e => e[0]),
            };
        }
        // --- End of CANHANHOA01 AI analysis ---

        const isLocationInRegion = (jobLocation: string, desiredRegion: string): boolean => {
            if (!desiredRegion) return false;
            const regionPrefectures = locations['Nhật Bản'][desiredRegion as keyof typeof locations['Nhật Bản']];
            if (!regionPrefectures) return false;
            return regionPrefectures.some(prefecture => jobLocation.toLowerCase().includes(prefecture.toLowerCase()));
        };
        
        for (const job of jobData) {
            const breakdown: { [key: string]: number } = {};
            let score = 0;
            let reasons: string[] = [];
            
            if (isAccurateMode) {
                if (profile.aspirations?.desiredVisaType && profile.aspirations.desiredVisaType !== job.visaType) continue;
                if (profile.aspirations?.desiredVisaDetail && profile.aspirations.desiredVisaDetail !== job.visaDetail) continue;
                if (profile.desiredIndustry && profile.desiredIndustry !== job.industry) continue;
                if (profile.aspirations?.desiredLocation && profile.aspirations.desiredLocation !== job.workLocation && !isLocationInRegion(job.workLocation, profile.aspirations.desiredLocation)) continue;
            }

            // --- Start of CANHANHOA01 Scoring ---
            if (behaviorAnalysis.preferredIndustries?.includes(job.industry)) {
                score += WEIGHTS.BEHAVIOR;
                breakdown['behavior_industry'] = WEIGHTS.BEHAVIOR;
                reasons.push(`vì bạn quan tâm đến ngành ${job.industry}`);
            }
            if (behaviorAnalysis.preferredLocations?.includes(job.workLocation)) {
                score += WEIGHTS.BEHAVIOR;
                breakdown['behavior_location'] = WEIGHTS.BEHAVIOR;
                 reasons.push(`vì bạn quan tâm đến các công việc tại ${job.workLocation}`);
            }
            if (behaviorAnalysis.preferredVisaTypes?.includes(job.visaDetail || '')) {
                score += WEIGHTS.BEHAVIOR;
                breakdown['behavior_visa'] = WEIGHTS.BEHAVIOR;
            }
            // --- End of CANHANHOA01 Scoring ---

            if (profile.aspirations?.desiredVisaType && job.visaType && !job.visaType.toLowerCase().includes(profile.aspirations.desiredVisaType.toLowerCase())) {
                continue;
            } else if (profile.aspirations?.desiredVisaType && job.visaType) {
                 score += WEIGHTS.VISA_TYPE;
                 breakdown['visaType'] = WEIGHTS.VISA_TYPE;
            }
            
            if (profile.aspirations?.desiredVisaDetail && job.visaDetail && job.visaDetail.toLowerCase() === profile.aspirations.desiredVisaDetail.toLowerCase()) {
                score += WEIGHTS.VISA_DETAIL;
                breakdown['visaDetail'] = WEIGHTS.VISA_DETAIL;
            }

            if (profile.desiredIndustry && job.industry && job.industry.toLowerCase().includes(profile.desiredIndustry.toLowerCase())) {
                score += WEIGHTS.INDUSTRY;
                breakdown['industry'] = WEIGHTS.INDUSTRY;
            }

            if (profile.aspirations?.desiredLocation && job.workLocation) {
                const desiredLocLower = profile.aspirations.desiredLocation.toLowerCase();
                const jobLocLower = job.workLocation.toLowerCase();
                if (jobLocLower.includes(desiredLocLower) || isLocationInRegion(job.workLocation, profile.aspirations.desiredLocation)) {
                    score += WEIGHTS.LOCATION;
                    breakdown['location'] = WEIGHTS.LOCATION;
                }
            }

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

            if (profile.experience && profile.experience.length > 0) {
                profile.experience.forEach(exp => {
                    if (exp.company && exp.role && (job.industry.toLowerCase().includes(exp.company.toLowerCase()) || job.title.toLowerCase().includes(exp.role.toLowerCase()))) {
                        score += WEIGHTS.EXPERIENCE_INDUSTRY;
                        breakdown['experience'] = (breakdown['experience'] || 0) + WEIGHTS.EXPERIENCE_INDUSTRY;
                    }
                })
            }

            if (profile.personalInfo?.language && job.languageRequirement && job.languageRequirement !== "Không yêu cầu") {
                 const profileLangLevel = parseInt(profile.personalInfo.language.match(/N(\d)/)?.[1] || '0', 10);
                 const jobLangLevel = parseInt(job.languageRequirement.match(/N(\d)/)?.[1] || '0', 10);
                 if(profileLangLevel > 0 && jobLangLevel > 0 && profileLangLevel <= jobLangLevel){
                     score += WEIGHTS.LANGUAGE;
                     breakdown['language'] = WEIGHTS.LANGUAGE;
                 }
            }

            if(job.gender && job.gender !== 'Cả nam và nữ' && profile.personalInfo?.gender && profile.personalInfo.gender !== job.gender){
                 score -= 1000;
            } else {
                score += WEIGHTS.GENDER;
                breakdown['gender'] = WEIGHTS.GENDER;
            }

            if (job.ageRequirement && profile.personalInfo?.birthYear) {
                const [minAge, maxAge] = job.ageRequirement.split('-').map(Number);
                const profileAge = new Date().getFullYear() - profile.personalInfo.birthYear;
                if (profileAge >= minAge && profileAge <= maxAge) {
                    score += WEIGHTS.AGE;
                    breakdown['age'] = WEIGHTS.AGE;
                }
            }

            if (score > 0) {
                const finalReason = reasons.length > 0 ? "Gợi ý " + reasons.join(' và ') : undefined;
                matchedJobs.push({ job, score, matchBreakdown: breakdown, reason: finalReason });
            }
        }

        matchedJobs.sort((a, b) => b.score - a.score);

        return matchedJobs.slice(0, 20);
    }
);
