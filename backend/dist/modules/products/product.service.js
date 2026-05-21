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
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProducts = listProducts;
exports.getProduct = getProduct;
exports.createProduct = createProduct;
exports.updateProductStock = updateProductStock;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const mongoose_1 = require("mongoose");
const product_model_1 = require("./product.model");
const ApiError_1 = require("../../utils/ApiError");
// GET /api/products
async function listProducts() {
    const products = await product_model_1.ProductModel.find({});
    return products.map((p) => p.toJSON());
}
// GET /api/products/:id
async function getProduct(productId) {
    const product = await product_model_1.ProductModel.findById(productId);
    if (!product) {
        throw ApiError_1.ApiError.notFound('Product not found');
    }
    return product.toJSON();
}
// POST /api/products  (admin only)
async function createProduct(dto) {
    try {
        const product = await product_model_1.ProductModel.create({
            ...dto,
            created_at: new Date(),
        });
        return product.toJSON();
    }
    catch (err) {
        const e = err;
        if (e.message?.includes('duplicate key') || e.code === 11000) {
            throw ApiError_1.ApiError.badRequest('Product SKU already exists');
        }
        throw ApiError_1.ApiError.internal(e.message);
    }
}
// PATCH /api/products/:id  (admin only) — stock update only
async function updateProductStock(productId, dto) {
    const result = await product_model_1.ProductModel.findByIdAndUpdate(productId, { $set: { stock_on_hand: dto.stock_on_hand } }, { new: true });
    if (!result) {
        throw ApiError_1.ApiError.notFound('Product not found');
    }
    return result.toJSON();
}
// PUT /api/products/:id  (admin only) — full partial update
async function updateProduct(productId, dto) {
    const existing = await product_model_1.ProductModel.findById(productId);
    if (!existing) {
        throw ApiError_1.ApiError.notFound('Product not found');
    }
    // Build update dict with only provided fields (mirrors Python logic)
    const updateData = {};
    if (dto.name !== undefined)
        updateData.name = dto.name;
    if (dto.unit !== undefined)
        updateData.unit = dto.unit;
    if (dto.price !== undefined)
        updateData.price = dto.price;
    if (dto.stock_on_hand !== undefined)
        updateData.stock_on_hand = dto.stock_on_hand;
    if (dto.image_url !== undefined)
        updateData.image_url = dto.image_url;
    if (dto.description !== undefined)
        updateData.description = dto.description;
    if (dto.benefits !== undefined)
        updateData.benefits = dto.benefits;
    if (dto.storage !== undefined)
        updateData.storage = dto.storage;
    if (Object.keys(updateData).length === 0) {
        throw ApiError_1.ApiError.badRequest('No fields to update');
    }
    const updated = await product_model_1.ProductModel.findByIdAndUpdate(productId, { $set: updateData }, { new: true });
    if (!updated) {
        throw ApiError_1.ApiError.notFound('Product not found');
    }
    return updated.toJSON();
}
// DELETE /api/products/:id  (admin only)
async function deleteProduct(productId) {
    const product = await product_model_1.ProductModel.findById(productId);
    if (!product) {
        throw ApiError_1.ApiError.notFound('Product not found');
    }
    // Lazy import to avoid circular dependency
    const { SubscriptionModel } = await Promise.resolve().then(() => __importStar(require('../subscriptions/subscription.model')));
    const activeSubscriptions = await SubscriptionModel.countDocuments({
        'items.product_id': productId,
        status: 'active',
    });
    if (activeSubscriptions > 0) {
        throw ApiError_1.ApiError.badRequest(`Cannot delete product. It is used in ${activeSubscriptions} active subscription(s)`);
    }
    await product_model_1.ProductModel.deleteOne({ _id: new mongoose_1.Types.ObjectId(productId) });
    return { message: 'Product deleted successfully', id: productId };
}
//# sourceMappingURL=product.service.js.map