import { describe, expect, it, vi } from 'vitest';
import { ImprovementService } from '../improvementService';
import * as geminiClient from '../geminiClient';

vi.mock('../geminiClient', () => ({
  geminiChat: vi.fn(),
}));

describe('ImprovementService', () => {
  it('correctly parses and sanitizes the improved prompt', async () => {
    const mockOutput = JSON.stringify({
      improved_prompt: 'I want to attend AI sessions and network with founders. <script>alert(1)</script>',
      analysis: ['Added domain focus', 'Added networking intent'],
    });

    vi.mocked(geminiClient.geminiChat).mockResolvedValueOnce(mockOutput);

    const result = await ImprovementService.improvePrompt('Do something at the event');

    expect(result.improved_prompt).toContain('AI sessions');
    expect(result.improved_prompt).not.toContain('<script>');
    expect(result.analysis.length).toBe(2);
  });

  it('throws an error when Gemini API fails', async () => {
    vi.mocked(geminiClient.geminiChat).mockRejectedValueOnce(new Error('Gemini API failure'));

    await expect(ImprovementService.improvePrompt('bad query')).rejects.toThrow();
  });
});
