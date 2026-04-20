import { describe, expect, it, vi } from 'vitest';
import { EvalService } from '../evalService';

describe('EvalService', () => {
  describe('getHydratedPrompt', () => {
    it('hydrates a prompt with provided inputs', () => {
      const template = 'Translate to {{target_language}}: {{text}}';
      const inputs = {
        target_language: 'French',
        text: 'Hello world'
      };
      
      const result = (EvalService as any).getHydratedPrompt(template, inputs);
      expect(result).toBe('Translate to French: Hello world');
    });

    it('handles missing spaces in template tags', () => {
      const template = 'Translate to {{target_language}}: {{ text }}';
      const inputs = {
        target_language: 'Spanish',
        text: 'Good morning'
      };
      
      const result = (EvalService as any).getHydratedPrompt(template, inputs);
      expect(result).toBe('Translate to Spanish: Good morning');
    });

    it('leaves template unhydrated if input is missing', () => {
      const template = 'Hello {{name}}';
      const inputs = {};
      
      const result = (EvalService as any).getHydratedPrompt(template, inputs);
      expect(result).toBe('Hello {{name}}');
    });
  });

  describe('parseJudgeResult', () => {
    it('successfully parses valid JSON response', () => {
      const mockLlmResponse = '```json\n{"score": 5, "reason": "Perfect output"}\n```';
      const result = (EvalService as any).parseJudgeResult(mockLlmResponse);
      expect(result).toEqual({ score: 5, reason: 'Perfect output' });
    });

    it('returns a fallback result if JSON is invalid', () => {
      const mockLlmResponse = 'I think it deserves a 4 because xyz';
      const result = (EvalService as any).parseJudgeResult(mockLlmResponse);
      expect(result).toEqual({ score: 3, reason: 'Error parsing judge response.' });
    });
  });
});
