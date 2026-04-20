import express from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middleware/auth';
import { TestCaseService } from '../services/testCaseService';
import { asyncHandler } from '../lib/asyncHandler';
import { getAuthenticatedUserId, parsePagination, parseUuidParam } from '../lib/request';

const router = express.Router();

const CreateTestCaseSchema = z.object({
  inputs: z.record(z.string().max(100), z.union([z.string().max(10000), z.number(), z.boolean(), z.null()])),
  expected_output: z.string().max(500000)
});

// GET /api/prompts/:id/testcases
router.get('/:id/testcases', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = getAuthenticatedUserId(req);
  const id = parseUuidParam(req.params.id);
  const { limit, offset } = parsePagination(req.query as Record<string, unknown>);

  const result = await TestCaseService.listTestCases(id, userId, { limit, offset });
  res.json(result);
}));

// POST /api/prompts/:id/testcases
router.post('/:id/testcases', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = getAuthenticatedUserId(req);
  const id = parseUuidParam(req.params.id);
  const body = CreateTestCaseSchema.parse(req.body);

  const testCase = await TestCaseService.createTestCase(id, userId, body.inputs, body.expected_output);
  res.status(201).json(testCase);
}));

export default router;
