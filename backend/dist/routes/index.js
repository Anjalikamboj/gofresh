"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const product_routes_1 = __importDefault(require("../modules/products/product.routes"));
const subscription_routes_1 = __importDefault(require("../modules/subscriptions/subscription.routes"));
const order_routes_1 = __importDefault(require("../modules/orders/order.routes"));
const users_routes_1 = __importDefault(require("../modules/users/users.routes"));
const scheduler_routes_1 = __importDefault(require("../modules/scheduler/scheduler.routes"));
const router = (0, express_1.Router)();
// ── Module routes ─────────────────────────────────────────────────────────────
router.use('/auth', auth_routes_1.default);
router.use('/products', product_routes_1.default);
router.use('/subscriptions', subscription_routes_1.default);
router.use('/orders', order_routes_1.default);
router.use('/admin', users_routes_1.default);
router.use('/scheduler', scheduler_routes_1.default);
// ── Health check ──────────────────────────────────────────────────────────────
router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'healthy', service: 'GroFresh API' });
});
exports.default = router;
//# sourceMappingURL=index.js.map