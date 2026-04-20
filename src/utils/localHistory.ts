
export interface LocalPromptVersion {
  id: string;
  content: string;
  version_num: number;
  analysis_score: number | null;
  analysis_metrics: any | null;
  tags: string[];
  created_at: string;
}

export interface LocalPrompt {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  prompt_versions: LocalPromptVersion[];
}

const STORAGE_KEY = 'vaultprompt_history';

export const localHistory = {
  getPrompts(): LocalPrompt[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored) as LocalPrompt[];
      // Sort by updated_at desc
      return parsed.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    } catch (e) {
      console.error('Failed to parse local history:', e);
      return [];
    }
  },

  savePrompt(content: string, promptId?: string | null, analysisScore?: number, analysisMetrics?: any): LocalPrompt {
    const prompts = this.getPrompts();
    const now = new Date().toISOString();

    if (promptId) {
      const existingIdx = prompts.findIndex(p => p.id === promptId);
      if (existingIdx !== -1) {
        const prompt = prompts[existingIdx];
        const nextVersionNum = Math.max(...prompt.prompt_versions.map(v => v.version_num), 0) + 1;
        
        const newVersion: LocalPromptVersion = {
          id: crypto.randomUUID(),
          content,
          version_num: nextVersionNum,
          analysis_score: analysisScore ?? null,
          analysis_metrics: analysisMetrics ?? null,
          tags: [],
          created_at: now
        };

        prompt.prompt_versions.unshift(newVersion);
        prompt.updated_at = now;
        
        prompts[existingIdx] = prompt;
        this.persist(prompts);
        return prompt;
      }
    }

    // Create new prompt
    const newPrompt: LocalPrompt = {
      id: crypto.randomUUID(),
      name: content.split('\n')[0].trim().slice(0, 60) || `New Prompt ${new Date().toLocaleDateString()}`,
      created_at: now,
      updated_at: now,
      prompt_versions: [{
        id: crypto.randomUUID(),
        content,
        version_num: 1,
        analysis_score: analysisScore ?? null,
        analysis_metrics: analysisMetrics ?? null,
        tags: [],
        created_at: now
      }]
    };

    prompts.unshift(newPrompt);
    this.persist(prompts);
    return newPrompt;
  },

  updateTags(promptId: string, versionNum: number, tags: string[]): LocalPrompt | null {
    const prompts = this.getPrompts();
    const promptIdx = prompts.findIndex(p => p.id === promptId);
    if (promptIdx === -1) return null;

    const versionIdx = prompts[promptIdx].prompt_versions.findIndex(v => v.version_num === versionNum);
    if (versionIdx === -1) return null;

    prompts[promptIdx].prompt_versions[versionIdx].tags = tags;
    this.persist(prompts);
    return prompts[promptIdx];
  },

  deletePrompt(id: string): void {
    const prompts = this.getPrompts().filter(p => p.id !== id);
    this.persist(prompts);
  },

  exportHistory(): string {
    const prompts = this.getPrompts();
    return JSON.stringify(prompts, null, 2);
  },

  importHistory(jsonData: string): void {
    try {
      const imported = JSON.parse(jsonData) as LocalPrompt[];
      if (!Array.isArray(imported)) throw new Error('Invalid format');
      
      const current = this.getPrompts();
      const currentIds = new Set(current.map(p => p.id));
      
      // Merge: only add prompts that don't already exist by ID
      const toAdd = imported.filter(p => !currentIds.has(p.id));
      this.persist([...current, ...toAdd]);
    } catch (e) {
      console.error('Import failed:', e);
      throw new Error('Failed to import: Invalid JSON file format.');
    }
  },

  persist(prompts: LocalPrompt[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
    }
  }
};
