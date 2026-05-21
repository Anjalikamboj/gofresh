"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Wraps an async route handler and forwards any thrown errors to Express's
 * next() so they are handled by the centralized error middleware.
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.default = catchAsync;
//# sourceMappingURL=catchAsync.js.map