import { OpenAI } from 'openai';
import { env } from '../config/env';

export const getOpenRouterClient = () => {
  const apiKey = env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  return new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': env.SITE_URL,
      'X-Title': env.SITE_NAME,
    },
  });
};

export const getGroqClient = () => {
  const apiKey = env.GROQ_API_KEY;
  if (!apiKey) return null;

  return new OpenAI({
    apiKey,
    baseURL: 'https://api.groq.com/openai/v1',
  });
};

/**
 * Provides a unified chat interface with automatic fallback from OpenRouter to Groq.
 */
export const unifiedChatCompletion = async (
  params: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
  options?: { timeout?: number }
) => {
  const openRouter = getOpenRouterClient();
  if (openRouter) {
    try {
      return await openRouter.chat.completions.create(params, options);
    } catch (error) {
      console.error('OpenRouter failed, falling back to Groq:', error);
    }
  }

  const groq = getGroqClient();
  if (groq) {
    // Map common models to Groq equivalents if necessary
    let groqModel = params.model;
    if (params.model.includes('gpt-4o-mini') || params.model.includes('free')) {
      groqModel = 'llama-3.3-70b-versatile';
    }

    return await groq.chat.completions.create(
      {
        ...params,
        model: groqModel,
      },
      options
    );
  }

  throw new Error('No LLM provider (OpenRouter or Groq) is configured or available.');
};

/** @deprecated Use unifiedChatCompletion or getOpenRouterClient() instead */
export const getOpenAIClient = getOpenRouterClient;
