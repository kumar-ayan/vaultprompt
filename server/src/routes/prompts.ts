import express from 'express';
import { supabase } from '../services/supabaseClient';
import { z } from 'zod';
import { PromptService } from '../services/promptService';
import { AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler } from '../lib/asyncHandler';
import { getAuthenticatedUserId, parsePagination, parseUuidParam } from '../lib/request';

const router = express.Router();

const CreatePromptSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  initialContent: z.string().min(1).max(2000000) // 2 million chars max (~500k tokens)
});

// GET /api/prompts
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = getAuthenticatedUserId(req);
  const { limit, offset } = parsePagination(req.query as Record<string, unknown>);

  const result = await PromptService.listPrompts(userId, { limit, offset });
  res.json(result);
}));

// POST /api/prompts
router.post('/', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = getAuthenticatedUserId(req);
  const body = CreatePromptSchema.parse(req.body);

  // Create Prompt
  const { data: prompt, error: promptError } = await supabase
    .from('prompts')
    .insert([{ 
      name: body.name, 
      description: body.description,
      user_id: userId 
    }])
    .select()
    .single();

  if (promptError) throw promptError;

  // Create initial Version
  const { data: version, error: versionError } = await supabase
    .from('prompt_versions')
    .insert([{
      prompt_id: prompt.id,
      version_num: 1,
      content: body.initialContent,
      commit_message: 'Initial commit'
    }])
    .select()
    .single();

  if (versionError) {
    // Cleanup orphaned prompt
    await supabase.from('prompts').delete().eq('id', prompt.id);
    throw versionError;
  }

  res.status(201).json({ prompt, initialVersion: version });
}));

// GET /api/prompts/:id
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = getAuthenticatedUserId(req);
  const id = parseUuidParam(req.params.id);

  const prompt = await PromptService.getPromptById(id, userId);
  res.json(prompt);
}));

export default router;
