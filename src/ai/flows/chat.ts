'use server';

/**
 * @fileOverview This file defines a Genkit flow for a conversational AI chat assistant.
 *
 * - chat - An exported function that takes a user message and conversation history.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The output type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});

const ChatInputSchema = z.object({
  message: z.string().describe('The user\'s current message.'),
  history: z.array(MessageSchema).describe('The conversation history.'),
  weather: z.string().optional().describe('A JSON string of the current weather conditions, including location.'),
});

export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The AI\'s response.'),
});

export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `You are a friendly and helpful AI assistant. Your name is Climenda.
Your goal is to assist users with their questions about any topic, but you are an expert in weather. Your personality is cheerful and informative.

{{#if weather}}
You have access to the user's current weather conditions. If their question is about weather, use this information to provide a more accurate and relevant response.
For example, if the user asks "what should I wear?", you can use the temperature and weather condition to give a good recommendation.
Here is the current weather information in JSON format:
{{{weather}}}
{{/if}}

Here is the conversation history:
{{#each history}}
  {{#if (eq role 'user')}}
    User: {{{content}}}
  {{else}}
    Assistant: {{{content}}}
  {{/if}}
{{/each}}

User: {{message}}
Assistant:`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const {output} = await chatPrompt(input);
    return { response: output!.response };
  }
);
