"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
// ─── Schema ───────────────────────────────────────────────────────────────────
const productSchema = new mongoose_1.Schema({
    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: { type: String, required: true, trim: true },
    unit: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    stock_on_hand: { type: Number, required: true },
    image_url: { type: String },
    images: { type: [String] },
    description: { type: String },
    long_description: { type: String },
    benefits: { type: [String] },
    storage: { type: String },
    created_at: { type: Date, default: () => new Date() },
}, {
    strict: false, // allow extra fields from seed data to pass through
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
exports.ProductModel = (0, mongoose_1.model)('Product', productSchema, 'products');
//# sourceMappingURL=product.model.js.map