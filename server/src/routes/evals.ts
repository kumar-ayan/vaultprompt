import express from 'express';
import { z } from 'zod';
import { EvalService } from '../services/evalService';
import { ImprovementService } from '../services/improvementService';
import { asyncHandler } from '../lib/asyncHandler';

const router = express.Router();

const RunDirectEvalSchema = z.object({
  content: z.string(),
  models: z.array(z.string()),
  inputs: z.record(z.string(), z.any()).optional(),
  expected_output: z.string().optional()
});

// POST /api/evals/run-direct
// Stateless evaluation endpoint for multi-model comparison
router.post('/run-direct', asyncHandler(async (req, res) => {
  const body = RunDirectEvalSchema.parse(req.body);

  const results = await EvalService.runDirectMultiModelEvaluation(
    body.content, 
    body.models, 
    body.inputs, 
    body.expected_output
  );
  
  res.json(results);
}));

const ImprovePromptSchema = z.object({
  content: z.string().min(1, 'Prompt content is required')
});

// POST /api/evals/improve
// Master Prompt Engineer logic to rewrite and optimize a prompt
router.post('/improve', asyncHandler(async (req, res) => {
  const body = ImprovePromptSchema.parse(req.body);
  const result = await ImprovementService.improvePrompt(body.content);
  res.json(result);
}));

export default router;
