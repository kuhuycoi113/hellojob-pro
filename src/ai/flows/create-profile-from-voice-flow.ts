
'use server';
/**
 * @fileOverview An AI flow to generate a candidate profile from a voice recording.
 *
 * - createProfileFromVoice - A function that handles the profile creation process from transcribed text.
 * - CreateProfileFromVoiceInput - The input type for the createProfileFromVoice function.
 * - textToSpeech - A function to convert text to speech audio data.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { CandidateProfileSchema, type CandidateProfile } from '@/ai/schemas';
import wav from 'wav';

export type CreateProfileFromVoiceInput = z.infer<typeof z.string>;

export async function createProfileFromVoice(
  input: CreateProfileFromVoiceInput
): Promise<CandidateProfile> {
  return createProfileFromVoiceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createProfileFromVoicePrompt',
  input: {schema: z.string()},
  output: {schema: CandidateProfileSchema, format: 'json'},
  model: 'googleai/gemini-2.0-flash',
  prompt: `You are an expert recruiter specializing in the Vietnamese and Japanese labor markets. Your task is to analyze the provided text, which is a transcription of a candidate's voice, and extract structured information to create a professional profile.

  Analyze the content carefully and populate all the fields in the provided JSON schema. Pay close attention to details like visa status (e.g., "Thực tập sinh", "Tokutei"), desired job location (e.g., "Kanagawa", "đầu Nhật"), contract end dates, and desired industries ("thực phẩm").

  Infer information when possible. For example:
  - If a user says "Thực tập sinh tháng 10 hết hợp đồng", you can infer their current role is "Thực tập sinh" and they are looking for a new job starting around October.
  - "muốn tìm đơn thực phẩm Tokutei đầu Nhật Kanagawa" means their desiredIndustry is "Thực phẩm", desired visa is "Tokutei Ginou", and location is "Kanagawa, Nhật Bản". "Đầu Nhật" means they are already in Japan.

  Populate the 'about' section with a summary of the user's request and current situation.

  If some information is not available, leave the corresponding string fields empty and array fields as empty arrays.

  Candidate's statement:
  "{{{input}}}"
  `,
});

const createProfileFromVoiceFlow = ai.defineFlow(
  {
    name: 'createProfileFromVoiceFlow',
    inputSchema: z.string(),
    outputSchema: CandidateProfileSchema,
  },
  async input => {
    if (!input) {
      throw new Error('A voice transcription must be provided.');
    }
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The AI failed to generate a profile. Please try again.');
    }
    return output;
  }
);


// Optional: Text-to-speech flow
export const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: z.string(),
    outputSchema: z.any(),
  },
  async query => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'}, // Choose a suitable voice
          },
        },
      },
      prompt: query,
    });
    if (!media) {
      throw new Error('No media returned from TTS model');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return {
      media: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });
    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', d => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));
    writer.write(pcmData);
    writer.end();
  });
}
