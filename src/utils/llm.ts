
export async function unifiedLLMCall<T>(
  systemMessage: string,
  userMessage: string,
  options: { timeout?: number; responseFormat?: 'json_object' | 'text' } = {}
): Promise<T> {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  const { timeout = 15000, responseFormat = 'json_object' } = options;

  // Try OpenRouter first
  if (openRouterKey && openRouterKey !== 'your-openrouter-api-key') {
    try {
      return await callProvider<T>(
        'https://openrouter.ai/api/v1/chat/completions',
        openRouterKey,
        'nvidia/nemotron-3-super-120b-a12b:free',
        systemMessage,
        userMessage,
        timeout,
        responseFormat
      );
    } catch (error) {
      console.error('OpenRouter failed, falling back to Groq:', error);
    }
  }

  // Fallback to Groq
  if (groqKey && groqKey !== 'your-groq-api-key') {
    return await callProvider<T>(
      'https://api.groq.com/openai/v1/chat/completions',
      groqKey,
      'llama-3.3-70b-versatile',
      systemMessage,
      userMessage,
      timeout,
      responseFormat
    );
  }

  throw new Error('No LLM provider (OpenRouter or Groq) is configured or available.');
}

async function callProvider<T>(
  url: string,
  apiKey: string,
  model: string,
  systemMessage: string,
  userMessage: string,
  timeout: number,
  responseFormat: 'json_object' | 'text'
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage },
        ],
        response_format: responseFormat === 'json_object' ? { type: 'json_object' } : undefined,
        temperature: 0.7,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LLM Provider Error (${url}): ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from LLM provider');
    }

    if (responseFormat === 'text') {
        return content as unknown as T;
    }

    try {
      return JSON.parse(content) as T;
    } catch {
      const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        return JSON.parse(match[1]) as T;
      }
      throw new Error(`Failed to parse JSON response: ${content}`);
    }
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('LLM request timed out. Please try again.');
    }
    throw err;
  }
}
