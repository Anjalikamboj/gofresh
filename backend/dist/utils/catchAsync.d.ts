import { Request, Response, NextFunction, RequestHandler } from 'express';
type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;
/**
 * Wraps an async route handler and forwards any thrown errors to Express's
 * next() so they are handled by the centralized error middleware.
 */
declare const catchAsync: (fn: AsyncRouteHandler) => RequestHandler;
export default catchAsync;
//# sourceMappingURL=catchAsync.d.ts.map