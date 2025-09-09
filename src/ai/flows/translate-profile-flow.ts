
'use server';
/**
 * @fileOverview An AI flow to translate a candidate profile into a target language.
 *
 * - translateProfile - A function that handles the profile translation process.
 * - TranslateProfileInput - The input type for the translateProfile function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { CandidateProfileSchema, type CandidateProfile } from '@/ai/schemas';
import { TranslateProfileInputSchema } from '@/ai/schemas/translate-profile-schema';
import type { TranslateProfileInput } from '@/ai/schemas/translate-profile-schema';

// Create a partial schema for translation to avoid re-translating static data
const TranslatableCandidateProfileSchema = CandidateProfileSchema.partial().pick({
  name: true,
  headline: true,
  location: true,
  about: true,
  desiredIndustry: true,
  notes: true,
  skills: true,
  interests: true,
  certifications: true,
}).extend({
    education: z.array(z.object({
        school: z.string(),
        degree: z.string(),
    })).optional(),
    experience: z.array(z.object({
        company: z.string(),
        role: z.string(),
        description: z.string(),
    })).optional(),
    personalInfo: z.object({
        gender: z.string().optional(),
        language: z.string().optional(),
        tattooStatus: z.string().optional(),
        hepatitisBStatus: z.string().optional(),
    }).optional(),
    aspirations: z.object({
        desiredLocation: z.string().optional(),
        desiredVisaType: z.string().optional(),
        desiredVisaDetail: z.string().optional(),
        specialAspirations: z.string().optional(),
    }).optional(),
});

export async function translateProfile(
  input: TranslateProfileInput
): Promise<Partial<CandidateProfile>> {
  return translateProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateProfilePrompt',
  input: { schema: TranslateProfileInputSchema },
  output: { schema: TranslatableCandidateProfileSchema, format: 'json' },
  model: 'googleai/gemini-2.0-flash',
  prompt: `Translate the text fields of the following JSON candidate profile into the target language: {{{targetLanguage}}}.
  
  IMPORTANT: 
  - Only translate the string values.
  - Do not translate field names (keys).
  - Do not translate non-textual data like numbers (birthYear, gradYear), URLs, or specific technical terms unless appropriate for the language.
  - Keep the original JSON structure.
  - If a field is empty or null, keep it as is.
  - For arrays of objects (like education, experience), translate the relevant text fields within each object.
  - For simple arrays of strings (like skills, interests, certifications), translate each string in the array.

  Original Profile:
  {{{json profile}}}
  `,
});


const translateProfileFlow = ai.defineFlow(
  {
    name: 'translateProfileFlow',
    inputSchema: TranslateProfileInputSchema,
    outputSchema: TranslatableCandidateProfileSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("The AI failed to translate the profile. Please try again.");
    }
    return output;
  }
);
