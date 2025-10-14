import {genkit, type Genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Prevent re-initialization during hot reloads in development
// https://github.com/firebase/genkit/issues/214
const g = global as any;
if (!g.ai) {
  g.ai = genkit({
    plugins: [googleAI()],
    model: 'googleai/gemini-2.0-flash',
  });
}

export const ai: Genkit = g.ai;
