"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubscription = exports.updateSubscription = exports.createSubscription = exports.getSubscription = exports.listSubscriptions = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const subscriptionService = __importStar(require("./subscription.service"));
// GET /api/subscriptions
exports.listSubscriptions = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.user_id;
    const subscriptions = await subscriptionService.listSubscriptions(userId);
    res.status(200).json(subscriptions);
});
// GET /api/subscriptions/:id
exports.getSubscription = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.user_id;
    const subscription = await subscriptionService.getSubscription(req.params.id, userId);
    res.status(200).json(subscription);
});
// POST /api/subscriptions
exports.createSubscription = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.user_id;
    const dto = {
        items: req.body.items,
        frequency: req.body.frequency,
        start_date: req.body.start_date,
    };
    const subscription = await subscriptionService.createSubscription(userId, dto);
    res.status(200).json(subscription);
});
// PATCH /api/subscriptions/:id
exports.updateSubscription = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.user_id;
    const dto = {
        status: req.body.status,
        items: req.body.items,
        frequency: req.body.frequency,
    };
    const subscription = await subscriptionService.updateSubscription(req.params.id, userId, dto);
    res.status(200).json(subscription);
});
// DELETE /api/subscriptions/:id
exports.deleteSubscription = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.user_id;
    const result = await subscriptionService.deleteSubscription(req.params.id, userId);
    res.status(200).json(result);
});
//# sourceMappingURL=subscription.controller.js.map