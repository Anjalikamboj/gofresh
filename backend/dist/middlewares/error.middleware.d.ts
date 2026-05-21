import { Request, Response, NextFunction } from 'express';
/**
 * Centralized error handling middleware.
 * Returns responses in the same { detail: string } format as the Python backend.
 */
export declare function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction): void;
//# sourceMappingURL=error.middleware.d.ts.map