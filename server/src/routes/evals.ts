import express from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middleware/auth';
import { EvalService } from '../services/evalService';
import { asyncHandler } from '../lib/asyncHandler';
import { getAuthenticatedUserId } from '../lib/request';

const router = express.Router();

const RunEvalSchema = z.object({
  prompt_version_id: z.string().uuid(),
  test_case_id: z.string().uuid(),
  model: z.string().optional()
});

const RunMultiEvalSchema = z.object({
  prompt_version_id: z.string().uuid(),
  test_case_id: z.string().uuid(),
  models: z.array(z.string())
});

const RunDirectEvalSchema = z.object({
  content: z.string(),
  models: z.array(z.string()),
  inputs: z.record(z.any()).optional(),
  expected_output: z.string().optional()
});

// POST /api/evals/run
router.post('/run', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = getAuthenticatedUserId(req);
  const body = RunEvalSchema.parse(req.body);

  const evalRecord = await EvalService.runEvaluation(userId, body.prompt_version_id, body.test_case_id, body.model);
  res.json(evalRecord);
}));

// POST /api/evals/run-multi
router.post('/run-multi', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = getAuthenticatedUserId(req);
  const body = RunMultiEvalSchema.parse(req.body);

  const results = await EvalService.runMultiModelEvaluation(userId, body.prompt_version_id, body.test_case_id, body.models);
  res.json(results);
}));

// POST /api/evals/run-direct
router.post('/run-direct', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const body = RunDirectEvalSchema.parse(req.body);

  const results = await EvalService.runDirectMultiModelEvaluation(body.content, body.models, body.inputs, body.expected_output);
  res.json(results);
}));

export default router;
