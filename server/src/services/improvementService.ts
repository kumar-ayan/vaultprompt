import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';
import { geminiChat } from './geminiClient';

const ImprovedQuerySchema = z.object({
  improved_prompt: z.string().describe('The completely rewritten, optimized event query.'),
  analysis: z.array(z.string()).describe('Bullet points explaining exactly what was improved and why.'),
});

export class ImprovementService {
  /**
   * Applies the "Event Query Refiner" logic to optimize a vague event goal
   * into a highly specific, actionable query using Gemini 1.5 Pro.
   */
  static async improvePrompt(content: string) {
    const systemInstruction = `You are the EventPilot Query Refiner — powered by Google Gemini.
Your task is to analyze a user's vague event goal and rewrite it into a highly specific, actionable event query.

A great event query should:
1. Clearly state the attendee's primary objective (networking, learning, exploring, etc.).
2. Define specific domains, topics, or technologies of interest.
3. Specify any time constraints or schedule blocks available.
4. Ask for targeted session, speaker, and networking recommendations.

Current Draft:
---
${content}
---

Respond ONLY in this exact JSON format (no markdown, no extra text):
{
  "improved_prompt": "The rewritten, highly specific event query",
  "analysis": ["Improvement 1", "Improvement 2"]
}`;

    const raw = await geminiChat(
      [{ role: 'user', content: systemInstruction }],
      'gemini-1.5-pro-latest',
      30000
    );

    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
    const result = ImprovedQuerySchema.parse(JSON.parse(cleaned));
    result.improved_prompt = DOMPurify.sanitize(result.improved_prompt);
    return result;
  }
}
