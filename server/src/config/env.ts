import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
  SITE_URL: z.url().default('http://localhost:3000'),
  SITE_NAME: z.string().min(1).default('EventPilot'),
  GOOGLE_PERSPECTIVE_API_KEY: z.string().min(1).optional(),
  GOOGLE_SEARCH_API_KEY: z.string().min(1).optional(),
  GOOGLE_SEARCH_CX: z.string().min(1).optional(),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  const messages = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
  throw new Error(`Invalid environment configuration:\n${messages.join('\n')}`);
}

export const env = {
  ...parsed.data,
  allowedOrigins: parsed.data.ALLOWED_ORIGINS.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};
