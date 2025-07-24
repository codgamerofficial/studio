// This file holds the Genkit flow for suggesting calendar events based on weather forecast.

'use server';

/**
 * @fileOverview This file defines a Genkit flow that suggests calendar events based on the weather forecast.
 *
 * - suggestEvents - An exported function that takes weather data and location as input and returns event suggestions.
 * - SuggestEventsInput - The input type for the suggestEvents function.
 * - SuggestEventsOutput - The output type for the suggestEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestEventsInputSchema = z.object({
  location: z.string().describe('The location for which to suggest events.'),
  weatherDescription: z.string().describe('A description of the current weather conditions.'),
  temperature: z.number().describe('The current temperature in Celsius.'),
});

export type SuggestEventsInput = z.infer<typeof SuggestEventsInputSchema>;

const SuggestEventsOutputSchema = z.object({
  suggestions: z.array(
    z.string().describe('A suggested event or activity based on the weather.')
  ).describe('A list of suggested events based on the weather conditions.')
});

export type SuggestEventsOutput = z.infer<typeof SuggestEventsOutputSchema>;

export async function suggestEvents(input: SuggestEventsInput): Promise<SuggestEventsOutput> {
  return suggestEventsFlow(input);
}

const suggestEventsPrompt = ai.definePrompt({
  name: 'suggestEventsPrompt',
  input: {schema: SuggestEventsInputSchema},
  output: {schema: SuggestEventsOutputSchema},
  prompt: `You are a helpful assistant that suggests activities based on weather conditions.

  Location: {{location}}
  Weather Description: {{weatherDescription}}
  Temperature: {{temperature}}°C

  Suggest activities that are appropriate for the given weather conditions. Provide a few options.
  Keep it short and to the point.

  Output the suggestions in the following JSON format:
  {
    "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
  }`,
});

const suggestEventsFlow = ai.defineFlow(
  {
    name: 'suggestEventsFlow',
    inputSchema: SuggestEventsInputSchema,
    outputSchema: SuggestEventsOutputSchema,
  },
  async input => {
    const {output} = await suggestEventsPrompt(input);
    return output!;
  }
);
