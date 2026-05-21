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
exports.deleteProduct = exports.updateProduct = exports.updateProductStock = exports.createProduct = exports.getProduct = exports.listProducts = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const productService = __importStar(require("./product.service"));
// GET /api/products
exports.listProducts = (0, catchAsync_1.default)(async (_req, res) => {
    const products = await productService.listProducts();
    res.status(200).json(products);
});
// GET /api/products/:id
exports.getProduct = (0, catchAsync_1.default)(async (req, res) => {
    const product = await productService.getProduct(req.params.id);
    res.status(200).json(product);
});
// POST /api/products  (admin only)
exports.createProduct = (0, catchAsync_1.default)(async (req, res) => {
    const dto = {
        sku: req.body.sku,
        name: req.body.name,
        unit: req.body.unit,
        price: req.body.price,
        stock_on_hand: req.body.stock_on_hand,
        image_url: req.body.image_url,
        description: req.body.description,
        benefits: req.body.benefits,
        storage: req.body.storage,
    };
    const product = await productService.createProduct(dto);
    res.status(200).json(product);
});
// PATCH /api/products/:id  (admin only) — stock update
exports.updateProductStock = (0, catchAsync_1.default)(async (req, res) => {
    const dto = {
        stock_on_hand: req.body.stock_on_hand,
    };
    const product = await productService.updateProductStock(req.params.id, dto);
    res.status(200).json(product);
});
// PUT /api/products/:id  (admin only) — full update
exports.updateProduct = (0, catchAsync_1.default)(async (req, res) => {
    const dto = {
        name: req.body.name,
        unit: req.body.unit,
        price: req.body.price,
        stock_on_hand: req.body.stock_on_hand,
        image_url: req.body.image_url,
        description: req.body.description,
        benefits: req.body.benefits,
        storage: req.body.storage,
    };
    const product = await productService.updateProduct(req.params.id, dto);
    res.status(200).json(product);
});
// DELETE /api/products/:id  (admin only)
exports.deleteProduct = (0, catchAsync_1.default)(async (req, res) => {
    const result = await productService.deleteProduct(req.params.id);
    res.status(200).json(result);
});
//# sourceMappingURL=product.controller.js.map