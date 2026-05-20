import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

interface MongoError extends Error {
  code?: number;
}

/**
 * Centralized error handling middleware.
 * Returns responses in the same { detail: string } format as the Python backend.
 */
export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ detail: err.detail });
    return;
  }

  // Handle Mongoose duplicate key errors (code 11000)
  const mongoErr = err as MongoError;
  if (mongoErr.code === 11000) {
    res.status(400).json({ detail: 'Duplicate key error' });
    return;
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    res.status(404).json({ detail: 'Resource not found' });
    return;
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    res.status(422).json({ detail: err.message });
    return;
  }

  // Unhandled errors
  console.error('[ERROR]', err);
  res.status(500).json({ detail: 'Internal server error' });
}
