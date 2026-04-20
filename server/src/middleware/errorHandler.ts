import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../lib/errors';

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Global error handling middleware.
 * Prevents information disclosure by returning generic error messages
 * to the client while logging detailed errors internally.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const normalizedError = normalizeError(err);
  const statusCode = normalizedError.statusCode;
  
  // Log the error internally
  console.error(`[Error] ${req.method} ${req.url}:`, {
    message: normalizedError.message,
    code: normalizedError.code,
    stack: isDev ? normalizedError.stack : undefined,
    timestamp: new Date().toISOString(),
  });

  // Sanitized response for the client
  res.status(statusCode).json({
    error: isDev ? normalizedError.message : getSanitizedMessage(statusCode),
    code: normalizedError.code,
    // In production, we don't send the stack trace
    ...(isDev && { stack: normalizedError.stack }),
  });
}

function normalizeError(err: unknown) {
  if (err instanceof AppError) {
    return err;
  }

  if (err instanceof ZodError) {
    return new AppError(err.issues.map((issue) => issue.message).join('; '), 400, 'validation_error');
  }

  if (err instanceof SyntaxError && 'body' in err) {
    return new AppError('Invalid JSON payload.', 400, 'invalid_json');
  }

  if (err instanceof Error) {
    return new AppError(err.message, 500, 'internal_error');
  }

  return new AppError('An internal server error occurred.', 500, 'internal_error');
}

function getSanitizedMessage(statusCode: number): string {
  switch (statusCode) {
    case 400: return 'Bad request.';
    case 401: return 'Unauthorized.';
    case 403: return 'Forbidden.';
    case 404: return 'Resource not found.';
    case 429: return 'Too many requests.';
    default: return 'An internal server error occurred.';
  }
}
