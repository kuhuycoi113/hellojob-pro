
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

const g = global as any;

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
        japaneseProficiency: z.string().optional(),
        englishProficiency: z.string().optional(),
        tattooStatus: z.string().optional(),
        hepatitisBStatus: z.string().optional(),
    }).optional(),
    aspirations: z.object({
        desiredLocation: z.string().optional(),
        desiredVisaType: z.string().optional(),
        desiredVisaDetail: z.string().optional(),
        desiredJobDetail: z.string().optional(),
        specialAspirations: z.array(z.string()).optional(),
    }).optional(),
    documents: z.object({
        vietnam: z.array(z.object({ name: z.object({ vi: z.string() }) })) .optional(),
        japan: z.array(z.object({ name: z.object({ vi: z.string() }) })) .optional(),
        other: z.array(z.object({ name: z.object({ vi: z.string() }) })) .optional(),
    }).optional(),
});

export async function translateProfile(
  input: TranslateProfileInput
): Promise<Partial<CandidateProfile>> {
  // Before calling the flow, transform the documents array to fit the expected schema if needed.
  const profileForTranslation = {
      ...input.profile,
      documents: {
          vietnam: input.profile.documents?.vietnam?.map(doc => doc.name.vi),
          japan: input.profile.documents?.japan?.map(doc => doc.name.vi),
          other: input.profile.documents?.other?.map(doc => doc.name.vi),
      }
  };

  const flowInput = {
      ...input,
      profile: profileForTranslation,
  };
  
  const translatedPartialProfile = await translateProfileFlow(flowInput as any);

  // After getting the translation, transform the documents back to the original object structure
  const finalProfile = { ...translatedPartialProfile };
  if (translatedPartialProfile.documents && input.profile.documents) {
      finalProfile.documents = {
          vietnam: translatedPartialProfile.documents.vietnam?.map((translatedName, index) => ({
              ...input.profile.documents!.vietnam![index],
              name: {
                  ...input.profile.documents!.vietnam![index].name,
                  [input.targetLanguage.toLowerCase().slice(0, 2)]: translatedName.name.vi, // Assuming translation returns in 'vi' field
              },
          })),
          japan: translatedPartialProfile.documents.japan?.map((translatedName, index) => ({
              ...input.profile.documents!.japan![index],
              name: {
                  ...input.profile.documents!.japan![index].name,
                  [input.targetLanguage.toLowerCase().slice(0, 2)]: translatedName.name.vi,
              },
          })),
          other: translatedPartialProfile.documents.other?.map((translatedName, index) => ({
              ...input.profile.documents!.other![index],
              name: {
                  ...input.profile.documents!.other![index].name,
                  [input.targetLanguage.toLowerCase().slice(0, 2)]: translatedName.name.vi,
              },
          })),
      };
  }

  return finalProfile;
}

const prompt = g.translateProfilePrompt || ai.definePrompt({
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
  - For arrays of objects (like education, experience, documents), translate the relevant text fields within each object.
  - For simple arrays of strings (like skills, interests, certifications), translate each string in the array.

  Original Profile:
  {{{json profile}}}
  `,
});
g.translateProfilePrompt = prompt;


const translateProfileFlow = g.translateProfileFlow || ai.defineFlow(
  {
    name: 'translateProfileFlow',
    inputSchema: TranslateProfileInputSchema,
    outputSchema: TranslatableCandidateProfileSchema,
  },
  async (input) => {
    // To handle the schema mismatch, we temporarily flatten the documents for the AI
    const profileForAI = { ...input.profile };
    if (profileForAI.documents) {
        profileForAI.documents = {
            // @ts-ignore
            vietnam: profileForAI.documents.vietnam?.map(d => d.name.vi),
            // @ts-ignore
            japan: profileForAI.documents.japan?.map(d => d.name.vi),
            // @ts-ignore
            other: profileForAI.documents.other?.map(d => d.name.vi),
        }
    }

    const { output } = await prompt({ ...input, profile: profileForAI as any });

    if (!output) {
      throw new Error("The AI failed to translate the profile. Please try again.");
    }
    
    // Transform the translated strings back into the object structure
    if (output.documents && input.profile.documents) {
        // @ts-ignore
        output.documents.vietnam = output.documents.vietnam?.map(nameStr => ({ name: { vi: nameStr } }));
        // @ts-ignore
        output.documents.japan = output.documents.japan?.map(nameStr => ({ name: { vi: nameStr } }));
        // @ts-ignore
        output.documents.other = output.documents.other?.map(nameStr => ({ name: { vi: nameStr } }));
    }

    return output;
  }
);
g.translateProfileFlow = translateProfileFlow;
