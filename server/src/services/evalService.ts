import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';
import { geminiChat } from './geminiClient';

const JudgeResultSchema = z.object({
  score: z.coerce.number().int().min(1).max(5),
  reason: z.string().min(1),
});

const EVENT_COPILOT_SYSTEM_PROMPT =
  "You are EventPilot, an AI Copilot for Physical Events. " +
  "Provide a contextual, friendly, and well-structured itinerary. " +
  "Always include: a time-based plan (if the user specifies availability), " +
  "at least 3 specific session or activity recommendations, " +
  "and exactly 2 actionable networking icebreakers tailored to the user's domain.";

export class EvalService {
  /**
   * Runs event plan generation for a user query using Gemini exclusively.
   * Returns results directly to the client (stateless).
   */
  static async runDirectMultiModelEvaluation(
    content: string,
    models: string[],
    inputs: Record<string, unknown> = {},
    expectedOutput?: string
  ) {
    const hydratedPrompt = this.getHydratedPrompt(content, inputs);

    const evaluations = await Promise.allSettled(
      models.map(async (model) => {
        // Generate the event plan via Gemini
        const rawOutput = await geminiChat(
          [
            { role: 'system', content: EVENT_COPILOT_SYSTEM_PROMPT },
            { role: 'user', content: hydratedPrompt },
          ],
          model,
          20000
        );

        const actualOutput = DOMPurify.sanitize(rawOutput);
        if (!actualOutput) {
          throw new Error(`Gemini model ${model} returned an empty response.`);
        }

        // Use Gemini as the judge too — no OpenRouter needed
        let judgeResult = null;
        if (expectedOutput) {
          const judgePrompt = `You are an expert event planning evaluator.
Compare the ACTUAL ITINERARY OUTPUT to the EXPECTED CRITERIA.
Rate the quality and completeness of the ACTUAL OUTPUT from 1 to 5 (5 being perfect).

EXPECTED CRITERIA:
${expectedOutput}

ACTUAL ITINERARY:
${actualOutput}

Respond ONLY in this exact JSON format (no markdown, no extra text):
{"score": 4, "reason": "Brief explanation of the rating"}`;

          const judgeRaw = await geminiChat(
            [{ role: 'user', content: judgePrompt }],
            'gemini-1.5-flash', // Use the faster flash model for judging
            10000
          );

          judgeResult = this.parseJudgeResult(judgeRaw);
        }

        return {
          model,
          actual_output: actualOutput,
          score: judgeResult?.score ?? null,
          judgement_reason: judgeResult?.reason ?? null,
        };
      })
    );

    return evaluations.map((res, index) => {
      if (res.status === 'fulfilled') {
        return { model: models[index], status: 'success', data: res.value };
      }
      return {
        model: models[index],
        status: 'error',
        error: (res.reason as Error).message,
      };
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
      const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
      const result = JudgeResultSchema.safeParse(JSON.parse(cleaned));
      if (result.success) return result.data;
      console.warn('Judge result validation failed, using fallback:', result.error.issues);
      return { score: 3, reason: 'Unable to fully parse the judge rating.' };
    } catch (err) {
      console.error('Failed to parse judge result:', err);
      return { score: 3, reason: 'Error parsing judge response.' };
    }
  }

  private static escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
