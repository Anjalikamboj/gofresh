import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { TokenPayload } from '../modules/auth/auth.types';

/**
 * Extracts and verifies the Bearer JWT from the Authorization header.
 * Attaches the decoded payload to req.user.
 * Mirrors FastAPI's get_current_user dependency.
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      new ApiError(401, 'Could not validate credentials'),
    );
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET_KEY) as TokenPayload;

    if (!payload.sub) {
      return next(new ApiError(401, 'Could not validate credentials'));
    }

    req.user = {
      email: payload.sub,
      user_id: payload.user_id,
      role: payload.role ?? 'user',
    };

    next();
  } catch {
    next(new ApiError(401, 'Could not validate credentials'));
  }
}

/**
 * Verifies the authenticated user has the "admin" role.
 * Mirrors FastAPI's get_current_admin dependency.
 * Must be used AFTER authMiddleware.
 */
export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError(403, 'Not enough permissions'));
  }
  next();
}
