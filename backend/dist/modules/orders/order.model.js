"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = require("mongoose");
// ─── Schema ───────────────────────────────────────────────────────────────────
const subscriptionItemSchema = new mongoose_1.Schema({
    sku: { type: String, required: true },
    quantity: { type: Number, required: true },
}, { _id: false });
const inventoryCheckSchema = new mongoose_1.Schema({
    sku: { type: String, required: true },
    required: { type: Number, required: true },
    available: { type: Number, required: true },
}, { _id: false });
const orderSchema = new mongoose_1.Schema({
    subscription_id: { type: String, required: true },
    user_id: { type: String, required: true },
    items: { type: [subscriptionItemSchema], required: true },
    scheduled_for: { type: Date, required: true },
    status: {
        type: String,
        enum: ['created', 'blocked', 'delivered', 'cancelled'],
        required: true,
    },
    reason: { type: String },
    inventory_check: { type: [inventoryCheckSchema] },
    created_at: { type: Date, default: () => new Date() },
}, {
    toJSON: {
        transform(_doc, ret) {
            ret['id'] = ret['_id'].toString();
            delete ret['_id'];
            delete ret['__v'];
            return ret;
        },
    },
    timestamps: false,
});
// Unique index mirroring Python: db.orders.create_index([(subscription_id, scheduled_for)], unique=True)
orderSchema.index({ subscription_id: 1, scheduled_for: 1 }, { unique: true });
exports.OrderModel = (0, mongoose_1.model)('Order', orderSchema, 'orders');
//# sourceMappingURL=order.model.js.map