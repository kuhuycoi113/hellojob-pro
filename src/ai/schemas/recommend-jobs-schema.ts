
import { z } from 'zod';

// Schema for the AI to extract structured search criteria
export const JobSearchCriteriaSchema = z.object({
  industry: z.string().optional().describe('Ngành nghề mà người dùng muốn tìm, ví dụ: "Cơ khí", "Thực phẩm".'),
  workLocation: z.string().optional().describe('Địa điểm làm việc mong muốn, ví dụ: "Tokyo", "Aichi".'),
  visaType: z.string().optional().describe('Loại hình visa, ví dụ: "Thực tập sinh", "Kỹ năng đặc định", "Kỹ sư".'),
  gender: z.string().optional().describe('Yêu cầu về giới tính, là "Nam" hoặc "Nữ".'),
  sortBy: z.string().optional().describe('Tiêu chí sắp xếp, ví dụ: "lương cao nhất", "mới nhất".'),
  limit: z.number().optional().describe('Số lượng kết quả mong muốn, ví dụ: 10.'),
});

// Define the schema for a single recommended job in the response
export const RecommendedJobSchema = z.object({
  id: z.string().describe('The unique ID of the job from the provided list.'),
  title: z.string().describe('The title of the job.'),
  reason: z.string().describe('A brief, friendly, and encouraging reason in Vietnamese explaining why this job is a good match for the user, based on their query and the job details.'),
});

export type RecommendedJob = z.infer<typeof RecommendedJobSchema>;

// Define the schema for the final flow's output to the user
export const JobRecommendationResponseSchema = z.object({
  recommendations: z.array(RecommendedJobSchema).describe('A list of recommended jobs.'),
  message: z.string().describe("A friendly, conversational, and helpful summary message in Vietnamese to the user."),
  suggestedReplies: z.array(z.string()).optional().describe('A list of short, suggested replies for the user to click on to continue the conversation.'),
});

export type JobRecommendationResponse = z.infer<typeof JobRecommendationResponseSchema>;
