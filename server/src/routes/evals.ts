import express from 'express';
import { z } from 'zod';
import { EvalService } from '../services/evalService';
import { asyncHandler } from '../lib/asyncHandler';

const router = express.Router();

const RunDirectEvalSchema = z.object({
  content: z.string(),
  models: z.array(z.string()),
  inputs: z.record(z.any()).optional(),
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

export default router;
