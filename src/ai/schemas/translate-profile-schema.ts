
import { z } from 'zod';
import { CandidateProfileSchema } from '@/ai/schemas';

export const TranslateProfileInputSchema = z.object({
  profile: CandidateProfileSchema,
  targetLanguage: z.string().describe('The language to translate the profile into (e.g., "Japanese", "English", "Vietnamese").'),
});
export type TranslateProfileInput = z.infer<typeof TranslateProfileInputSchema>;
