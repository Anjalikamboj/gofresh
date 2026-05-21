"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listOrders = listOrders;
exports.getOrder = getOrder;
exports.updateOrderStatus = updateOrderStatus;
const order_model_1 = require("./order.model");
const ApiError_1 = require("../../utils/ApiError");
const VALID_STATUSES = ['created', 'blocked', 'delivered', 'cancelled'];
// GET /api/orders  — optionally filtered by user_stub_id query param
// NOTE: Mirrors Python backend exactly — filters by "user_stub_id" field in MongoDB,
// which differs from "user_id". This preserves the original API contract.
async function listOrders(userStubId) {
    const query = {};
    if (userStubId) {
        query['user_stub_id'] = userStubId;
    }
    const orders = await order_model_1.OrderModel.find(query).sort({ scheduled_for: -1 });
    return orders.map((o) => o.toJSON());
}
// GET /api/orders/:id
async function getOrder(orderId) {
    const order = await order_model_1.OrderModel.findById(orderId);
    if (!order) {
        throw ApiError_1.ApiError.notFound('Order not found');
    }
    return order.toJSON();
}
// PATCH /api/orders/:id/status  — status passed as query param (mirrors Python)
async function updateOrderStatus(orderId, status) {
    if (!VALID_STATUSES.includes(status)) {
        throw ApiError_1.ApiError.badRequest('Invalid status');
    }
    const updated = await order_model_1.OrderModel.findByIdAndUpdate(orderId, { $set: { status } }, { new: true });
    if (!updated) {
        throw ApiError_1.ApiError.notFound('Order not found');
    }
    return updated.toJSON();
}
//# sourceMappingURL=order.service.js.map