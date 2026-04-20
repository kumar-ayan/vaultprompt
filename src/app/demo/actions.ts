'use server';

import { unifiedLLMCall } from '../../utils/llm';

export interface AnalysisResult {
  clarity: number;
  constraints: number;
  output_format: number;
  hallucination_risk: 'Low' | 'Medium' | 'High';
  overall: number;
  suggestions: string[];
  summary: string;
}

export interface FixResult {
  improvedPrompt: string;
  changes: { description: string; reason: string }[];
}

const ANALYZER_PROMPT = `You are a brutally honest prompt quality auditor for high-stakes AI engineering.
Your job is to find flaws and assess the production-readiness of prompts.

CORE PILLARS:
1. CLARITY: Is the task unambiguous? (0-100)
2. CONSTRAINTS: Are there clear boundaries, negative constraints, and rules? (0-100)
3. OUTPUT FORMAT: Is the desired structure (JSON, Markdown, Tone, Length) defined? (0-100)

RISK ASSESSMENT:
- Hallucination Risk: Assess based on vague instructions or lack of grounding. 
  - "High": Vague tasks ("write a story"), no context, or contradictory rules.
  - "Medium": Some context but ambiguous steps.
  - "Low": Highly structured with clear examples or strict schemas.

SUGGESTIONS (Smart Suggestions):
- Provide 3-5 actionable "Pro-tips" starting with "✔".
- Focus on: "Add output format", "Define tone", "Reduce ambiguity", "Add persona", "Include examples".

SCORING RULES:
- If no output format: max 40 for Output Format.
- If no negative constraints: max 60 for Constraints.
- If task is a single sentence: max 30 for overall.

Return ONLY this JSON, no markdown:
{
  "clarity": <number 0-100>,
  "constraints": <number 0-100>,
  "output_format": <number 0-100>,
  "hallucination_risk": "Low" | "Medium" | "High",
  "overall": <number 0-100>,
  "suggestions": ["✔ <tip 1>", "✔ <tip 2>", ...],
  "summary": "<1-2 sentences summarizing the status>"
}`;

const FIXER_PROMPT = `You are a master prompt engineer. Look at the provided prompt and rewrite it to be significantly better.
Focus on:
- Preserving the exact tone, role, and persona the user specified (e.g. if they say "sad poet", keep it as a sad poet — do NOT reframe it as an engineer or technical role)
- Adding clear persona/context that matches what the user intended
- Being highly specific about constraints
- Adding formatting instructions (e.g. JSON, XML, specific layout)
- Providing an example if helpful
- Removing vague or ambiguous language

CRITICAL RULE: Never substitute or replace the user's specified role or persona with a technical or engineering equivalent. Respect the domain the user chose.

You MUST respond EXACTLY in this JSON format:
{
  "improvedPrompt": "The full text of the newly improved prompt...",
  "changes": [
    { "description": "Added output format instruction", "reason": "improves specificity" },
    { "description": "Added role context 'You are a senior engineer'", "reason": "grounds the LLM's tone" }
  ]
}`;

export async function runMultiModelEvalAction(content: string, models: string[]): Promise<import('./usePromptManager').EvalResult[]> {
  try {
    const response = await fetch('http://localhost:3001/api/evals/run-direct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        models,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend Error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("Multi-model Evaluation Failed:", message);
    throw new Error(message);
  }
}

export async function analyzePromptAction(text: string): Promise<AnalysisResult> {
  try {
    const result = await unifiedLLMCall<AnalysisResult>(
      ANALYZER_PROMPT,
      `Evaluate this prompt carefully and score it based on its actual content:\n\n"""\n${text}\n"""`
    );

    return {
      ...result,
      clarity: Math.min(100, Math.max(0, result.clarity || 0)),
      constraints: Math.min(100, Math.max(0, result.constraints || 0)),
      output_format: Math.min(100, Math.max(0, result.output_format || 0)),
      hallucination_risk: result.hallucination_risk || 'Medium',
      overall: Math.min(100, Math.max(0, result.overall || 0)),
      suggestions: result.suggestions || [],
      summary: result.summary || ""
    };
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("Analysis Failed:", message);
    throw new Error(message);
  }
}

export async function improvePromptAction(text: string): Promise<FixResult> {
  try {
    const result = await unifiedLLMCall<FixResult>(
      FIXER_PROMPT,
      `Here is the prompt to improve:\n\n${text}`
    );
    return result;
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("Improvement Failed:", message);
    throw new Error(message);
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unexpected error';
}
