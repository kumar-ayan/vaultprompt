import { z } from 'zod';
import { AuthenticatedRequest } from '../middleware/auth';
import { BadRequestError, UnauthorizedError } from './errors';

const PaginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

const UuidSchema = z.string().uuid();

export function getAuthenticatedUserId(req: AuthenticatedRequest) {
  const userId = req.user?.id;
  if (!userId) {
    throw new UnauthorizedError('Missing authenticated user context.');
  }

  return userId;
}

export function parseUuidParam(value: unknown, name = 'id') {
  const parsed = UuidSchema.safeParse(value);
  if (!parsed.success) {
    throw new BadRequestError(`Invalid ${name}. Expected a UUID.`, 'invalid_uuid');
  }

  return parsed.data;
}

export function parsePagination(query: Record<string, unknown>) {
  const parsed = PaginationSchema.safeParse(query);
  if (!parsed.success) {
    throw new BadRequestError('Invalid pagination parameters.', 'invalid_pagination');
  }

  return parsed.data;
}

export function parsePositiveInteger(value: unknown, name: string) {
  const parsed = z.coerce.number().int().positive().safeParse(value);
  if (!parsed.success) {
    throw new BadRequestError(`Invalid ${name}. Expected a positive integer.`, 'invalid_integer');
  }

  return parsed.data;
}
