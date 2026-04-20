import { z } from 'zod';
import { unifiedChatCompletion } from './openaiClient';

const JudgeResultSchema = z.object({
  score: z.coerce.number().int().min(1).max(5),
  reason: z.string().min(1),
});

export class EvalService {
  /**
   * Runs evaluations for a direct prompt content across multiple models.
   * This is now stateless and returns results directly to the client.
   */
  static async runDirectMultiModelEvaluation(content: string, models: string[], inputs: Record<string, unknown> = {}, expectedOutput?: string) {
    const hydratedPrompt = this.getHydratedPrompt(content, inputs);

    const evaluations = await Promise.allSettled(
      models.map(async (model) => {
        const generationCompletion = await unifiedChatCompletion(
          {
            model: model,
            messages: [{ role: 'user', content: hydratedPrompt }],
          },
          { timeout: 15000 }
        );
        const actualOutput = generationCompletion.choices[0]?.message?.content?.trim();
        if (!actualOutput) {
          throw new Error(`Evaluation model ${model} returned an empty response`);
        }

        let judgeResult = null;
        if (expectedOutput) {
          const judgePrompt = `
          You are an expert AI evaluator. Compare the ACTUAL OUTPUT to the EXPECTED OUTPUT.
          Rate the accuracy and quality of the ACTUAL OUTPUT from 1 to 5 (5 being perfect).

          EXPECTED OUTPUT:
          ${expectedOutput}

          ACTUAL OUTPUT:
          ${actualOutput}

          Provide your response in the following JSON format strictly:
          {
            "score": 5,
            "reason": "Clear explanation of the score"
          }
          `;

          const judgeCompletion = await unifiedChatCompletion(
            {
              model: 'openai/gpt-4o-mini',
              messages: [{ role: 'user', content: judgePrompt }],
              response_format: { type: 'json_object' },
            },
            { timeout: 15000 }
          );
          judgeResult = this.parseJudgeResult(judgeCompletion.choices[0]?.message?.content ?? '{}');
        }

        return {
          model,
          actual_output: actualOutput,
          score: judgeResult?.score ?? null,
          judgement_reason: judgeResult?.reason ?? null
        };
      })
    );

    return evaluations.map((res, index) => {
      if (res.status === 'fulfilled') {
        return { model: models[index], status: 'success', data: res.value };
      } else {
        return { model: models[index], status: 'error', error: (res.reason as Error).message };
      }
    });
  }

  private static getHydratedPrompt(template: string, inputs: Record<string, unknown>) {
    let prompt = template;
    for (const [key, value] of Object.entries(inputs)) {
      const regex = new RegExp(`{{\\s*${this.escapeRegExp(key)}\\s*}}`, 'g');
      prompt = prompt.replace(regex, String(value));
    }
    return prompt;
  }

  private static parseJudgeResult(content: string) {
    try {
      // Clean up common LLM formatting issues
      const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
      const result = JudgeResultSchema.safeParse(JSON.parse(cleaned));
      if (result.success) return result.data;
      
      console.warn('Judge result validation failed, using fallback:', result.error.issues);
      return { score: 3, reason: 'Failed to parse high-quality judgement payload' };
    } catch (err) {
      console.error('Failed to parse judge result:', err);
      const result = { score: 3, reason: 'Error parsing judge payload' };
      return result;
    }
  }

  private static escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
  }
}
