"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSubscriptions = listSubscriptions;
exports.getSubscription = getSubscription;
exports.createSubscription = createSubscription;
exports.updateSubscription = updateSubscription;
exports.deleteSubscription = deleteSubscription;
const mongoose_1 = require("mongoose");
const subscription_model_1 = require("./subscription.model");
const product_model_1 = require("../products/product.model");
const ApiError_1 = require("../../utils/ApiError");
// GET /api/subscriptions
async function listSubscriptions(userId) {
    const subscriptions = await subscription_model_1.SubscriptionModel.find({ user_id: userId });
    return subscriptions.map((s) => s.toJSON());
}
// GET /api/subscriptions/:id
async function getSubscription(subscriptionId, userId) {
    const subscription = await subscription_model_1.SubscriptionModel.findOne({
        _id: new mongoose_1.Types.ObjectId(subscriptionId),
        user_id: userId,
    });
    if (!subscription) {
        throw ApiError_1.ApiError.notFound('Subscription not found');
    }
    return subscription.toJSON();
}
// POST /api/subscriptions
async function createSubscription(userId, dto) {
    if (!['daily', 'weekly'].includes(dto.frequency)) {
        throw ApiError_1.ApiError.badRequest('Frequency must be "daily" or "weekly"');
    }
    // Verify all products exist (mirrors Python validation)
    for (const item of dto.items) {
        const product = await product_model_1.ProductModel.findOne({ sku: item.sku });
        if (!product) {
            throw ApiError_1.ApiError.badRequest(`Product ${item.sku} not found`);
        }
    }
    const start_date = dto.start_date ? new Date(dto.start_date) : new Date();
    const subscription = await subscription_model_1.SubscriptionModel.create({
        user_id: userId,
        items: dto.items,
        frequency: dto.frequency,
        start_date,
        next_run_at: start_date,
        status: 'active',
        created_at: new Date(),
    });
    return subscription.toJSON();
}
// PATCH /api/subscriptions/:id
async function updateSubscription(subscriptionId, userId, dto) {
    // Verify ownership
    const existing = await subscription_model_1.SubscriptionModel.findOne({
        _id: new mongoose_1.Types.ObjectId(subscriptionId),
        user_id: userId,
    });
    if (!existing) {
        throw ApiError_1.ApiError.notFound('Subscription not found');
    }
    const updateData = {};
    if (dto.status !== undefined)
        updateData.status = dto.status;
    if (dto.items !== undefined)
        updateData.items = dto.items;
    if (dto.frequency !== undefined)
        updateData.frequency = dto.frequency;
    if (Object.keys(updateData).length === 0) {
        throw ApiError_1.ApiError.badRequest('No update data provided');
    }
    const updated = await subscription_model_1.SubscriptionModel.findByIdAndUpdate(subscriptionId, { $set: updateData }, { new: true });
    if (!updated) {
        throw ApiError_1.ApiError.notFound('Subscription not found');
    }
    return updated.toJSON();
}
// DELETE /api/subscriptions/:id
async function deleteSubscription(subscriptionId, userId) {
    const result = await subscription_model_1.SubscriptionModel.deleteOne({
        _id: new mongoose_1.Types.ObjectId(subscriptionId),
        user_id: userId,
    });
    if (result.deletedCount === 0) {
        throw ApiError_1.ApiError.notFound('Subscription not found');
    }
    return { message: 'Subscription deleted successfully' };
}
//# sourceMappingURL=subscription.service.js.map