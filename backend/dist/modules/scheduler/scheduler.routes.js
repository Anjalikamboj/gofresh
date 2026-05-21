"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scheduler_controller_1 = require("./scheduler.controller");
const router = (0, express_1.Router)();
// POST /api/scheduler/run — public endpoint (mirrors Python backend, no auth)
router.post('/run', scheduler_controller_1.triggerScheduler);
exports.default = router;
//# sourceMappingURL=scheduler.routes.js.map