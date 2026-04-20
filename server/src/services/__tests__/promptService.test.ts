import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PromptService } from '../promptService';
import { supabase } from '../supabaseClient';

// Mock the supabase client
vi.mock('../supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
  }
}));

describe('PromptService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('verifyPromptOwnership', () => {
    it('should return the prompt id if ownership is verified', async () => {
      const mockPromptId = '123e4567-e89b-12d3-a456-426614174000';
      const mockUserId = '987fcdeb-51a2-43d7-9012-345678901234';

      // Setup the chained mock
      const mockSingle = vi.fn().mockResolvedValue({ data: { id: mockPromptId }, error: null });
      const mockEq2 = vi.fn().mockReturnValue({ single: mockSingle });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 });
      
      (supabase.from as any).mockReturnValue({ select: mockSelect });

      const result = await PromptService.verifyPromptOwnership(mockPromptId, mockUserId);

      expect(supabase.from).toHaveBeenCalledWith('prompts');
      expect(mockSelect).toHaveBeenCalledWith('id');
      expect(mockEq1).toHaveBeenCalledWith('id', mockPromptId);
      expect(mockEq2).toHaveBeenCalledWith('user_id', mockUserId);
      expect(result).toBe(mockPromptId);
    });

    it('should throw a 404 error if prompt is not found or unauthorized', async () => {
      const mockPromptId = '123e4567-e89b-12d3-a456-426614174000';
      const mockUserId = 'unauthorized-user';

      // Setup mock to simulate an error (not found)
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: new Error('Not found') });
      const mockEq2 = vi.fn().mockReturnValue({ single: mockSingle });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 });
      
      (supabase.from as any).mockReturnValue({ select: mockSelect });

      await expect(PromptService.verifyPromptOwnership(mockPromptId, mockUserId))
        .rejects.toThrow('Prompt not found or unauthorized');
    });
  });
});