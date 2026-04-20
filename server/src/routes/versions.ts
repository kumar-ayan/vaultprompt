import express from 'express';
import { z } from 'zod';
import * as diff from 'diff';
import { AuthenticatedRequest } from '../middleware/auth';
import { VersionService } from '../services/versionService';
import { asyncHandler } from '../lib/asyncHandler';
import {
  getAuthenticatedUserId,
  parsePagination,
  parsePositiveInteger,
  parseUuidParam,
} from '../lib/request';

const router = express.Router();

const CreateVersionSchema = z.object({
  content: z.string().min(1).max(2000000), // 2 million chars max (~500k tokens)
  commit_message: z.string().max(1000).optional()
});

const UpdateTagsSchema = z.object({
  tags: z.array(z.string().max(50)).max(10)
});

// GET /api/prompts/:id/versions
router.get('/:id/versions', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = getAuthenticatedUserId(req);
  const id = parseUuidParam(req.params.id);
  const { limit, offset } = parsePagination(req.query as Record<string, unknown>);

  const result = await VersionService.listVersions(id, userId, { limit, offset });
  res.json(result);
}));

// POST /api/prompts/:id/versions
router.post('/:id/versions', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = getAuthenticatedUserId(req);
  const id = parseUuidParam(req.params.id);
  const body = CreateVersionSchema.parse(req.body);

  const version = await VersionService.createVersion(id, userId, body.content, body.commit_message);
  res.status(201).json(version);
}));

// PATCH /api/prompts/:id/versions/:versionNum/tags
router.patch('/:id/versions/:versionNum/tags', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = getAuthenticatedUserId(req);
  const id = parseUuidParam(req.params.id);
  const versionNum = parsePositiveInteger(req.params.versionNum, 'versionNum');
  const body = UpdateTagsSchema.parse(req.body);

  const version = await VersionService.updateVersionTags(id, userId, versionNum, body.tags);
  res.json(version);
}));

// GET /api/prompts/:id/diff?v1=1&v2=2
router.get('/:id/diff', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = getAuthenticatedUserId(req);
  const id = parseUuidParam(req.params.id);
  const v1 = parsePositiveInteger(req.query.v1, 'v1');
  const v2 = parsePositiveInteger(req.query.v2, 'v2');

  const { text1, text2 } = await VersionService.getVersionsForDiff(id, userId, v1, v2);

  const patch = diff.createPatch(`prompt-${id}`, text1, text2);
  const diffWords = diff.diffWords(text1, text2);

  res.json({ patch, diffWords });
}));

export default router;
