import { supabase } from './supabaseClient';
import { PromptService, PaginationOptions } from './promptService';

export class TestCaseService {
  /**
   * Lists test cases for a specific prompt with pagination.
   * Verifies prompt ownership first.
   */
  static async listTestCases(promptId: string, userId: string, options: PaginationOptions = {}) {
    await PromptService.verifyPromptOwnership(promptId, userId);

    const limit = options.limit || 20;
    const offset = options.offset || 0;

    const { data, error, count } = await supabase
      .from('test_cases')
      .select('*', { count: 'exact' })
      .eq('prompt_id', promptId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      data,
      pagination: { limit, offset, total: count ?? data?.length ?? 0 }
    };
  }

  /**
   * Creates a new test case for a prompt.
   * Verifies prompt ownership first.
   */
  static async createTestCase(promptId: string, userId: string, inputs: Record<string, unknown>, expectedOutput: string) {
    await PromptService.verifyPromptOwnership(promptId, userId);

    const { data: testCase, error } = await supabase
      .from('test_cases')
      .insert([{
        prompt_id: promptId,
        inputs: inputs,
        expected_output: expectedOutput
      }])
      .select()
      .single();

    if (error) throw error;
    
    return testCase;
  }
}
