import { Request, Response, NextFunction } from 'express';
/**
 * Extracts and verifies the Bearer JWT from the Authorization header.
 * Attaches the decoded payload to req.user.
 * Mirrors FastAPI's get_current_user dependency.
 */
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): void;
/**
 * Verifies the authenticated user has the "admin" role.
 * Mirrors FastAPI's get_current_admin dependency.
 * Must be used AFTER authMiddleware.
 */
export declare function adminMiddleware(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.middleware.d.ts.map