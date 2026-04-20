import { supabase } from './supabaseClient';
import { NotFoundError } from '../lib/errors';

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export class PromptService {
  /**
   * Verifies that a prompt belongs to a specific user.
   * Returns the prompt ID if successful, throws an error otherwise.
   */
  static async verifyPromptOwnership(promptId: string, userId: string) {
    const { data, error } = await supabase
      .from('prompts')
      .select('id')
      .eq('id', promptId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new NotFoundError('Prompt not found or unauthorized');
    }

    return data.id;
  }

  /**
   * Lists prompts for a user with pagination.
   */
  static async listPrompts(userId: string, options: PaginationOptions = {}) {
    const limit = options.limit || 20;
    const offset = options.offset || 0;

    const { data, error, count } = await supabase
      .from('prompts')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      data,
      pagination: { limit, offset, total: count ?? data?.length ?? 0 }
    };
  }

  /**
   * Gets a single prompt by ID for a specific user.
   */
  static async getPromptById(promptId: string, userId: string) {
    const { data, error } = await supabase
      .from('prompts')
      .select('*, prompt_versions(*)')
      .eq('id', promptId)
      .eq('user_id', userId)
      .order('version_num', { foreignTable: 'prompt_versions', ascending: false })
      .limit(20, { foreignTable: 'prompt_versions' })
      .single();

    if (error) {
      throw new NotFoundError('Prompt not found or unauthorized');
    }

    data.prompt_versions = [...(data.prompt_versions ?? [])].sort(
      (left, right) => right.version_num - left.version_num
    );

    return data;
  }
}
