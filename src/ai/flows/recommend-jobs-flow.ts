
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

export async function recommendJobs(query: string): Promise<JobSearchCriteriaSchema | null> {
  return recommendJobsFlow(query);
}

// Main flow logic
const recommendJobsFlow = ai.defineFlow(
  {
    name: 'recommendJobsFlow',
    inputSchema: z.string(),
    outputSchema: JobSearchCriteriaSchema.nullable(),
  },
  async (query) => {
    if (!query) {
      return null;
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

    return criteria || null;
  }
);
