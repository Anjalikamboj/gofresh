"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionModel = void 0;
const mongoose_1 = require("mongoose");
// ─── Schema ───────────────────────────────────────────────────────────────────
const subscriptionItemSchema = new mongoose_1.Schema({
    sku: { type: String, required: true },
    quantity: { type: Number, required: true },
}, { _id: false });
const subscriptionSchema = new mongoose_1.Schema({
    user_id: { type: String, required: true },
    items: { type: [subscriptionItemSchema], required: true },
    frequency: { type: String, enum: ['daily', 'weekly'], required: true },
    start_date: { type: Date, required: true },
    next_run_at: { type: Date, required: true },
    status: { type: String, enum: ['active', 'paused'], default: 'active' },
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
// Mirror Python index: db.subscriptions.create_index([("user_stub_id", ASCENDING)])
// We also add an index on user_id which is the field actually queried
subscriptionSchema.index({ user_id: 1 });
subscriptionSchema.index({ user_stub_id: 1 }); // legacy index from Python DB
exports.SubscriptionModel = (0, mongoose_1.model)('Subscription', subscriptionSchema, 'subscriptions');
//# sourceMappingURL=subscription.model.js.map