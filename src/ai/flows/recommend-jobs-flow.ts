
'use server';
/**
 * @fileOverview An AI flow to recommend jobs to candidates based on a query.
 * It extracts structured criteria from the user's query, filters the job list,
 * and returns the top 10 results sorted by date and salary.
 *
 * - recommendJobs - A function that handles the job recommendation process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {jobData, Job} from '@/lib/mock-data';
import { JobSearchCriteriaSchema, JobRecommendationResponseSchema, type JobRecommendationResponse } from '@/ai/schemas/recommend-jobs-schema';

export async function recommendJobs(query: string): Promise<JobRecommendationResponse> {
  return recommendJobsFlow(query);
}

// Function to convert salary string to a comparable number
const parseSalary = (salaryStr?: string): number => {
    if (!salaryStr) return 0;
    // Remove non-numeric characters and parse, handle 'tr' for million
    const numericStr = salaryStr.replace(/,/g, '').toLowerCase().replace('tr', '000000');
    return parseInt(numericStr, 10) || 0;
};

// Main flow logic
const recommendJobsFlow = ai.defineFlow(
  {
    name: 'recommendJobsFlow',
    inputSchema: z.string(),
    outputSchema: JobRecommendationResponseSchema,
  },
  async (query) => {
    if (!query) {
      throw new Error("A query must be provided.");
    }

    // Step 1: Use AI to extract structured search criteria from the user's query
    const extractionPrompt = ai.definePrompt({
        name: 'extractJobCriteriaPrompt',
        input: { schema: z.string() },
        output: { schema: JobSearchCriteriaSchema },
        prompt: `Phân tích yêu cầu tìm việc của người dùng và trích xuất các tiêu chí có cấu trúc.
        
        Ví dụ:
        - "Tìm việc đặc định thực phẩm ở aichi" -> { visaType: "Kỹ năng đặc định", industry: "Thực phẩm", workLocation: "Aichi" }
        - "Em muốn tìm đơn hàng cơ khí đi mới cho nam" -> { industry: "Cơ khí", visaType: "Kỹ năng đặc định", gender: "Nam" }
        - "Có đơn nào cho nữ ở Osaka không ạ" -> { gender: "Nữ", workLocation: "Osaka" }
        - "Top 10 việc lương cao nhất" -> { sortBy: "salary", limit: 10 }
        
        Nếu người dùng không nói rõ, hãy để trống trường đó.

        Yêu cầu của người dùng: "{{{input}}}"`,
    });

    const { output: criteria } = await extractionPrompt(query);

    if (!criteria) {
      throw new Error("The AI failed to understand the query. Please try again.");
    }

    // Step 2: Filter the job list based on the extracted criteria
    let filteredJobs = jobData.filter(job => {
        const matchIndustry = !criteria.industry || job.industry.toLowerCase().includes(criteria.industry.toLowerCase());
        const matchLocation = !criteria.workLocation || job.workLocation.toLowerCase().includes(criteria.workLocation.toLowerCase());
        const matchVisa = !criteria.visaType || job.visaType?.toLowerCase().includes(criteria.visaType.toLowerCase());
        const matchGender = !criteria.gender || job.gender === 'Cả nam và nữ' || job.gender === criteria.gender;
        
        return matchIndustry && matchLocation && matchVisa && matchGender;
    });

    // Step 3: Sort the filtered list
    filteredJobs.sort((a, b) => {
        // Primary sort: newest first (assuming newest jobs have higher IDs or later dates)
        const dateA = new Date(a.postedTime.split(' ')[1].split('/').reverse().join('-'));
        const dateB = new Date(b.postedTime.split(' ')[1].split('/').reverse().join('-'));
        if (dateB.getTime() !== dateA.getTime()) {
            return dateB.getTime() - dateA.getTime();
        }

        // Secondary sort: highest salary first
        const salaryA = parseSalary(a.salary.basic);
        const salaryB = parseSalary(b.salary.basic);
        return salaryB - salaryA;
    });

    // Step 4: Get the top 10 results
    const topJobs = filteredJobs.slice(0, 10);

    // Step 5: Generate a friendly response message
    const message = topJobs.length > 0
      ? `Chào bạn, dựa trên yêu cầu của bạn, HelloJob AI đã tìm thấy ${topJobs.length} công việc phù hợp nhất:`
      : `Rất tiếc, không tìm thấy công việc nào phù hợp với yêu cầu "${query}". Bạn có muốn thử tìm kiếm với các tiêu chí khác không?`;
    
    return {
        message: message,
        recommendations: topJobs.map(job => ({
            id: job.id,
            title: job.title,
            reason: `Phù hợp vì là việc làm ngành ${job.industry} tại ${job.workLocation}.`
        })),
        suggestedReplies: topJobs.length > 0 ? ["Việc này có yêu cầu gì?", "Cảm ơn bạn"] : ["Tìm việc cơ khí", "Tìm việc tại Tokyo"]
    };
  }
);
