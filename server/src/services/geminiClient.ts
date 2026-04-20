import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';
import { env } from '../config/env';

/** Singleton Gemini client — throws early if key is missing. */
let _client: GoogleGenerativeAI | null = null;

export const getGeminiClient = (): GoogleGenerativeAI => {
  if (!env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured. Please set it in your .env file.');
  }
  if (!_client) {
    _client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }
  return _client;
};

export const getGeminiModel = (modelName = 'gemini-1.5-pro-latest'): GenerativeModel => {
  return getGeminiClient().getGenerativeModel({ model: modelName });
};

export interface GeminiMessage {
  role: 'system' | 'user';
  content: string;
}

/**
 * Sends a structured list of messages to Gemini and returns the plain text response.
 * System messages are prepended to the user content as Gemini doesn't have a native system role.
 */
export const geminiChat = async (
  messages: GeminiMessage[],
  modelName = 'gemini-1.5-pro-latest',
  timeoutMs = 30000
): Promise<string> => {
  const model = getGeminiModel(modelName);

  // Separate system messages and user message
  const systemParts = messages
    .filter(m => m.role === 'system')
    .map(m => m.content)
    .join('\n\n');

  const userMessages = messages.filter(m => m.role === 'user');
  const userContent = userMessages.map(m => m.content).join('\n');

  // Prepend system context to user prompt (Gemini best practice)
  const fullPrompt = systemParts
    ? `${systemParts}\n\n---\n\n${userContent}`
    : userContent;

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Gemini request timed out after ${timeoutMs}ms`)), timeoutMs)
  );

  const result = await Promise.race([
    model.generateContent(fullPrompt),
    timeoutPromise,
  ]);

  const text = result.response.text().trim();
  if (!text) throw new Error('Gemini returned an empty response.');
  return text;
};
