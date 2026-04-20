import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
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

export const getGeminiClient = () => {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Provides a unified chat interface with automatic fallback across providers.
 */
export const unifiedChatCompletion = async (
  params: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
  options?: { timeout?: number }
): Promise<OpenAI.Chat.Completions.ChatCompletion> => {
  const { model, messages, response_format } = params;

  // Direct Gemini Integration
  if (model.startsWith('gemini-') || model.startsWith('google/gemini-')) {
    const gemini = getGeminiClient();
    if (gemini) {
      try {
        const geminiModel = model.replace('google/', '');
        const genModel = gemini.getGenerativeModel({ model: geminiModel });
        
        // Convert OpenAI messages to Gemini history/prompt
        // For simplicity, we join all messages or use chat mode
        const chat = genModel.startChat({
          history: messages.slice(0, -1).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content as string }],
          })),
        });

        const lastMessage = messages[messages.length - 1].content as string;
        const result = await chat.sendMessage(lastMessage);
        const response = result.response;
        const text = response.text();

        // Map back to OpenAI format
        return {
          id: `gemini-${Date.now()}`,
          choices: [{
            index: 0,
            message: { role: 'assistant', content: text, refusal: null },
            finish_reason: 'stop',
            logprobs: null
          }],
          created: Math.floor(Date.now() / 1000),
          model,
          object: 'chat.completion',
          usage: { completion_tokens: 0, prompt_tokens: 0, total_tokens: 0 } // Gemini SDK doesn't return this simply
        } as OpenAI.Chat.Completions.ChatCompletion;
      } catch (error) {
        console.error('Gemini direct call failed, attempting fallback:', error);
      }
    }
  }

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

  throw new Error('No LLM provider configured or available.');
};

/** @deprecated Use unifiedChatCompletion or getOpenRouterClient() instead */
export const getOpenAIClient = getOpenRouterClient;
