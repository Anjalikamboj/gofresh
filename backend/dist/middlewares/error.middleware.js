"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const ApiError_1 = require("../utils/ApiError");
/**
 * Centralized error handling middleware.
 * Returns responses in the same { detail: string } format as the Python backend.
 */
function errorMiddleware(err, _req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_next) {
    if (err instanceof ApiError_1.ApiError) {
        res.status(err.statusCode).json({ detail: err.detail });
        return;
    }
    // Handle Mongoose duplicate key errors (code 11000)
    const mongoErr = err;
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
//# sourceMappingURL=error.middleware.js.map