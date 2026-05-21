"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.adminMiddleware = adminMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const ApiError_1 = require("../utils/ApiError");
/**
 * Extracts and verifies the Bearer JWT from the Authorization header.
 * Attaches the decoded payload to req.user.
 * Mirrors FastAPI's get_current_user dependency.
 */
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ApiError_1.ApiError(401, 'Could not validate credentials'));
    }
    const token = authHeader.slice(7);
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET_KEY);
        if (!payload.sub) {
            return next(new ApiError_1.ApiError(401, 'Could not validate credentials'));
        }
        req.user = {
            email: payload.sub,
            user_id: payload.user_id,
            role: payload.role ?? 'user',
        };
        next();
    }
    catch {
        next(new ApiError_1.ApiError(401, 'Could not validate credentials'));
    }
}
/**
 * Verifies the authenticated user has the "admin" role.
 * Mirrors FastAPI's get_current_admin dependency.
 * Must be used AFTER authMiddleware.
 */
function adminMiddleware(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return next(new ApiError_1.ApiError(403, 'Not enough permissions'));
    }
    next();
}
//# sourceMappingURL=auth.middleware.js.map