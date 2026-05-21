"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
/**
 * Custom API error class that mirrors FastAPI's HTTPException behaviour.
 * The error response body always uses { detail: string } to stay compatible
 * with the existing Python backend's error format.
 */
class ApiError extends Error {
    constructor(statusCode, detail) {
        super(detail);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.detail = detail;
        Error.captureStackTrace(this, this.constructor);
    }
    // Convenience factories matching common HTTP status codes used in Python backend
    static badRequest(detail) {
        return new ApiError(400, detail);
    }
    static unauthorized(detail = 'Could not validate credentials') {
        return new ApiError(401, detail);
    }
    static forbidden(detail = 'Not enough permissions') {
        return new ApiError(403, detail);
    }
    static notFound(detail) {
        return new ApiError(404, detail);
    }
    static internal(detail = 'Internal server error') {
        return new ApiError(500, detail);
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=ApiError.js.map