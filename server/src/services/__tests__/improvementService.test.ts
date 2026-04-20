import { describe, expect, it, vi } from 'vitest';
import { ImprovementService } from '../improvementService';
import * as openaiClient from '../openaiClient';

vi.mock('../openaiClient', () => ({
  unifiedChatCompletion: vi.fn(),
}));

describe('ImprovementService', () => {
  it('correctly parses and sanitizes the improved prompt', async () => {
    const mockOutput = JSON.stringify({
      improved_prompt: 'You are an AI assistant. Output <strong>results</strong> in JSON. <script>alert(1)</script>',
      analysis: ['Added role', 'Added format']
    });

    vi.mocked(openaiClient.unifiedChatCompletion).mockResolvedValueOnce({
      id: 'mock-id',
      created: 1234,
      model: 'gemini-1.5-pro-latest',
      object: 'chat.completion',
      choices: [
        {
          index: 0,
          finish_reason: 'stop',
          message: {
            role: 'assistant',
            content: mockOutput,
            refusal: null
          },
          logprobs: null
        }
      ],
      usage: {
        completion_tokens: 10,
        prompt_tokens: 10,
        total_tokens: 20
      }
    } as any);

    const result = await ImprovementService.improvePrompt('Do something');
    
    expect(result.improved_prompt).toContain('You are an AI assistant');
    expect(result.improved_prompt).not.toContain('<script>');
    expect(result.analysis.length).toBe(2);
  });

  it('throws an error when external API fails', async () => {
    vi.mocked(openaiClient.unifiedChatCompletion).mockRejectedValueOnce(new Error('API failure'));
    
    await expect(ImprovementService.improvePrompt('bad prompt')).rejects.toThrow('Failed to run Master Prompt Engineer improvement flow.');
  });
});
