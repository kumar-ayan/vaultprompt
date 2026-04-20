import { z } from 'zod';
import { supabase } from './supabaseClient';
import { unifiedChatCompletion } from './openaiClient';

const JudgeResultSchema = z.object({
  score: z.coerce.number().int().min(1).max(5),
  reason: z.string().min(1),
});

export class EvalService {
  /**
   * Runs an evaluation for a specific prompt version and test case using a specified model.
   * Verifies ownership by ensuring both belong to the user.
   */
  static async runEvaluation(userId: string, promptVersionId: string, testCaseId: string, model: string = 'openai/gpt-4o-mini') {
    // 1. Fetch Draft/Version
    const { data: version, error: versionError } = await supabase
      .from('prompt_versions')
      .select('*, prompts!inner(user_id)')
      .eq('id', promptVersionId)
      .eq('prompts.user_id', userId)
      .single();

    if (versionError || !version) {
      const err = new Error('Prompt version not found or unauthorized');
      (err as Error & { status?: number }).status = 404;
      throw err;
    }

    // 2. Fetch Test Case
    const { data: testCase, error: testCaseError } = await supabase
      .from('test_cases')
      .select('*')
      .eq('id', testCaseId)
      .eq('prompt_id', version.prompt_id)
      .single();

    if (testCaseError || !testCase) {
      const err = new Error('Test case not found or does not belong to this prompt');
      (err as Error & { status?: number }).status = 404;
      throw err;
    }

    const hydratedPrompt = this.getHydratedPrompt(version.content, testCase.inputs as Record<string, unknown>);

    // 3. Execution & Evaluation
    // 3a. Generate
    const generationCompletion = await unifiedChatCompletion(
      {
        model: model,
        messages: [{ role: 'user', content: hydratedPrompt }],
      },
      { timeout: 15000 }
    );
    const actualOutput = generationCompletion.choices[0]?.message?.content?.trim();
    if (!actualOutput) {
      const err = new Error(`Evaluation model ${model} returned an empty response`);
      (err as Error & { status?: number }).status = 502;
      throw err;
    }

    // 3b. LLM as Judge
    const judgePrompt = `
    You are an expert AI evaluator. Compare the ACTUAL OUTPUT to the EXPECTED OUTPUT.
    Rate the accuracy and quality of the ACTUAL OUTPUT from 1 to 5 (5 being perfect).

    EXPECTED OUTPUT:
    ${testCase.expected_output}

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
    const judgeResult = this.parseJudgeResult(judgeCompletion.choices[0]?.message?.content ?? '{}');

    // 4. Save Evaluation
    const { data: evalRecord, error: evalError } = await supabase
      .from('evaluations')
      .insert([{
        prompt_version_id: version.id,
        test_case_id: testCase.id,
        actual_output: actualOutput,
        score: judgeResult.score,
        judgement_reason: judgeResult.reason,
        model: model
      }])
      .select()
      .single();

    if (evalError) throw evalError;

    return evalRecord;
  }

  /**
   * Runs evaluations across multiple models simultaneously.
   */
  static async runMultiModelEvaluation(userId: string, promptVersionId: string, testCaseId: string, models: string[]) {
    const evaluations = await Promise.allSettled(
      models.map(model => this.runEvaluation(userId, promptVersionId, testCaseId, model))
    );

    return evaluations.map((res, index) => {
      if (res.status === 'fulfilled') {
        return { model: models[index], status: 'success', data: res.value };
      } else {
        return { model: models[index], status: 'error', error: (res.reason as Error).message };
      }
    });
  }

  /**
   * Runs evaluations for a direct prompt content across multiple models.
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
    let output = template;
    for (const [key, value] of Object.entries(inputs)) {
      output = output.replace(
        new RegExp(`{{\\s*${this.escapeRegExp(key)}\\s*}}`, 'g'),
        String(value)
      );
    }
    return output;
  }

  private static parseJudgeResult(rawContent: string) {
    const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonText = jsonMatch?.[1] ?? rawContent;
    let parsed: unknown;

    try {
      parsed = JSON.parse(jsonText);
    } catch {
      const err = new Error(`Judge returned invalid JSON: ${rawContent}`);
      (err as Error & { status?: number }).status = 502;
      throw err;
    }

    const result = JudgeResultSchema.safeParse(parsed);
    if (!result.success) {
      const err = new Error('Judge returned an invalid evaluation payload');
      (err as Error & { status?: number }).status = 502;
      throw err;
    }

    return result.data;
  }

  private static escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
