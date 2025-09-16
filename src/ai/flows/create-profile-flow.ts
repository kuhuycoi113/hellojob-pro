
'use server';
/**
 * @fileOverview An AI flow to generate a candidate profile from a resume/CV file or text.
 *
 * - createProfile - A function that handles the profile creation process.
 * - CreateProfileInput - The input type for the createProfile function.
 */

import {ai} from '@/ai/genkit';
import { z } from 'zod';
import { CandidateProfileSchema, type CandidateProfile } from '@/ai/schemas';

const CreateProfileInputSchema = z.object({
  document: z
    .string()
    .optional()
    .describe(
      "A CV or resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  text: z
    .string()
    .optional()
    .describe('A string containing the user\'s resume or self-description.'),
});
export type CreateProfileInput = z.infer<typeof CreateProfileInputSchema>;

export async function createProfile(
  input: CreateProfileInput
): Promise<CandidateProfile> {
  return createProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createProfilePrompt',
  input: {schema: CreateProfileInputSchema},
  output: {schema: CandidateProfileSchema, format: 'json'},
  model: 'googleai/gemini-2.0-flash',
  prompt: `You are an expert resume analyst. Your task is to extract structured information from the provided document or text and generate a professional profile.

  Follow this process carefully:
  1.  **Prioritize Structured Data:** First, meticulously scan the document/text to find and extract information that directly maps to the fields in the provided JSON schema (e.g., 'name', 'school', 'company', dates, etc.). Populate these fields with the exact information found.
  2.  **Generate Descriptive Fields:** After extracting all possible structured data, generate the content for descriptive fields like 'about'. Read the entire document to understand the candidate's background and write a brief, professional summary.
  3.  **Handle Missing Information:** If some information is not available in the source, leave the corresponding string fields empty and array fields as empty arrays. Do not invent information.

  Analyze the content carefully and populate all the fields in the provided JSON schema.
  Pay close attention to dates, job titles, and skills.
  
  {{#if document}}
  Document:
  {{media url=document}}
  {{/if}}

  {{#if text}}
  Text content:
  {{{text}}}
  {{/if}}
  `,
});

const createProfileFlow = ai.defineFlow(
  {
    name: 'createProfileFlow',
    inputSchema: CreateProfileInputSchema,
    outputSchema: CandidateProfileSchema,
  },
  async (input) => {
    if (!input.document && !input.text) {
      throw new Error("Either a document or text must be provided.");
    }
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("The AI failed to generate a profile. Please try again.");
    }
    return output;
  }
);
