import express from 'express';
import { z } from 'zod';
import { EvalService } from '../services/evalService';
import { ImprovementService } from '../services/improvementService';
import { SafetyService } from '../services/safetyService';
import { SearchService } from '../services/searchService';
import { asyncHandler } from '../lib/asyncHandler';

const router = express.Router();

const RunDirectEvalSchema = z.object({
  content: z.string(),
  models: z.array(z.string()),
  inputs: z.record(z.string(), z.any()).optional(),
  expected_output: z.string().optional(),
  useGrounding: z.boolean().optional()
});

// POST /api/evals/run-direct
// Generates an event plan via Gemini 1.5 Pro and scores it with Gemini Flash
router.post('/run-direct', asyncHandler(async (req, res) => {
  const body = RunDirectEvalSchema.parse(req.body);

  let finalContent = body.content;
  if (body.useGrounding) {
    const groundingContext = await SearchService.performGrounding(body.content);
    finalContent = `${groundingContext}\n\n${body.content}`;
  }

  const results = await EvalService.runDirectMultiModelEvaluation(
    finalContent, 
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

const SafetySchema = z.object({
  content: z.string().min(1, 'Prompt content is required')
});

// POST /api/evals/safety
// Trust & Safety auditing via Google Perspective API
router.post('/safety', asyncHandler(async (req, res) => {
  const body = SafetySchema.parse(req.body);
  const result = await SafetyService.analyzeToxicity(body.content);
  res.json(result);
}));

export default router;
