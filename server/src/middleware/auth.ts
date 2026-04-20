import { Request, Response, NextFunction } from 'express';
import { getSupabaseClient } from '../services/supabaseClient';
import { UnauthorizedError } from '../lib/errors';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

/**
 * Middleware to authenticate requests using Supabase JWT.
 * Expects 'Authorization: Bearer <token>' header.
 */
export async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or malformed authentication header. Expected "Bearer <token>"');
    }

    const token = authHeader.split(' ')[1];
    const supabase = getSupabaseClient();

    // supabase.auth.getUser(token) is the secure way to verify the JWT 
    // and retrieve the user object on the server.
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedError('Invalid or expired session.');
    }

    // Attach user information to the request object for use in routes
    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (err: unknown) {
    next(err);
  }
}
