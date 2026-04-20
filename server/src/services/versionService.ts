import { supabase } from './supabaseClient';
import { PromptService, PaginationOptions } from './promptService';
import { BadRequestError, NotFoundError } from '../lib/errors';

export class VersionService {
  /**
   * Lists versions for a specific prompt with pagination.
   * Verifies prompt ownership first.
   */
  static async listVersions(promptId: string, userId: string, options: PaginationOptions = {}) {
    await PromptService.verifyPromptOwnership(promptId, userId);

    const limit = options.limit || 20;
    const offset = options.offset || 0;

    const { data, error, count } = await supabase
      .from('prompt_versions')
      .select('*', { count: 'exact' })
      .eq('prompt_id', promptId)
      .order('version_num', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      data,
      pagination: { limit, offset, total: count ?? data?.length ?? 0 }
    };
  }

  /**
   * Creates a new version for a prompt.
   * Verifies prompt ownership and handles version numbering.
   */
  static async createVersion(promptId: string, userId: string, content: string, commitMessage?: string) {
    await PromptService.verifyPromptOwnership(promptId, userId);
    const version = await this.insertVersionWithRetry(promptId, content, commitMessage);
    
    // Update prompts updated_at
    await supabase
      .from('prompts')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', promptId);

    return version;
  }

  /**
   * Updates tags for a specific version.
   * Verifies prompt ownership.
   */
  static async updateVersionTags(promptId: string, userId: string, versionNum: number, tags: string[]) {
    await PromptService.verifyPromptOwnership(promptId, userId);

    const { data, error } = await supabase
      .from('prompt_versions')
      .update({ tags })
      .eq('prompt_id', promptId)
      .eq('version_num', versionNum)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError(`Version ${versionNum} not found`);

    return data;
  }

  /**
   * Gets two specific versions for diffing.
   * Verifies prompt ownership.
   */
  static async getVersionsForDiff(promptId: string, userId: string, v1: number, v2: number) {
    await PromptService.verifyPromptOwnership(promptId, userId);

    if (v1 === v2) {
      throw new BadRequestError('v1 and v2 must reference different versions.', 'duplicate_versions');
    }

    const { data, error } = await supabase
      .from('prompt_versions')
      .select('content, version_num')
      .eq('prompt_id', promptId)
      .in('version_num', [v1, v2]);

    if (error) throw error;
    if (!data || data.length !== 2) {
      throw new NotFoundError('One or both versions not found');
    }

    return {
      text1: data.find(d => d.version_num === v1)?.content ?? '',
      text2: data.find(d => d.version_num === v2)?.content ?? ''
    };
  }

  private static async insertVersionWithRetry(promptId: string, content: string, commitMessage?: string) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const { data: latest, error: fetchError } = await supabase
        .from('prompt_versions')
        .select('version_num')
        .eq('prompt_id', promptId)
        .order('version_num', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      const latestVersionNum = latest?.[0]?.version_num ?? 0;
      const nextVersionNum = latestVersionNum + 1;

      const { data: version, error: versionError } = await supabase
        .from('prompt_versions')
        .insert([{
          prompt_id: promptId,
          version_num: nextVersionNum,
          content,
          commit_message: commitMessage ?? `Update to version ${nextVersionNum}`
        }])
        .select()
        .single();

      if (!versionError && version) {
        return version;
      }

      if (versionError?.code !== '23505') {
        throw versionError;
      }
    }

    throw new Error('Failed to create a new version after multiple retries.');
  }
}
