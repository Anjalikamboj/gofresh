"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerScheduler = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const scheduler_service_1 = require("./scheduler.service");
const ApiError_1 = require("../../utils/ApiError");
// POST /api/scheduler/run
exports.triggerScheduler = (0, catchAsync_1.default)(async (_req, res) => {
    try {
        await (0, scheduler_service_1.runOrderGenerationJob)();
        res.status(200).json({ message: 'Scheduler triggered successfully' });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        throw ApiError_1.ApiError.internal(message);
    }
});
//# sourceMappingURL=scheduler.controller.js.map