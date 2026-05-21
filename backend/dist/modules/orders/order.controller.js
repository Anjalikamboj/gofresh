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
exports.updateOrderStatus = exports.getOrder = exports.listOrders = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const orderService = __importStar(require("./order.service"));
// GET /api/orders?user_stub_id=...
exports.listOrders = (0, catchAsync_1.default)(async (req, res) => {
    const userStubId = req.query.user_stub_id;
    const orders = await orderService.listOrders(userStubId);
    res.status(200).json(orders);
});
// GET /api/orders/:id
exports.getOrder = (0, catchAsync_1.default)(async (req, res) => {
    const order = await orderService.getOrder(req.params.id);
    res.status(200).json(order);
});
// PATCH /api/orders/:id/status?status=delivered
exports.updateOrderStatus = (0, catchAsync_1.default)(async (req, res) => {
    // status is a query parameter (mirrors FastAPI behaviour for simple type params)
    const status = req.query.status;
    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.status(200).json(order);
});
//# sourceMappingURL=order.controller.js.map