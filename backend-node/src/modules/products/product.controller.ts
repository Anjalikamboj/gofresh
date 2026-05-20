import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import * as productService from './product.service';
import {
  ProductCreateDto,
  ProductStockUpdateDto,
  ProductFullUpdateDto,
} from './product.types';

// GET /api/products
export const listProducts = catchAsync(async (_req: Request, res: Response) => {
  const products = await productService.listProducts();
  res.status(200).json(products);
});

// GET /api/products/:id
export const getProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.getProduct(req.params.id);
  res.status(200).json(product);
});

// POST /api/products  (admin only)
export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const dto: ProductCreateDto = {
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
export const updateProductStock = catchAsync(async (req: Request, res: Response) => {
  const dto: ProductStockUpdateDto = {
    stock_on_hand: req.body.stock_on_hand,
  };
  const product = await productService.updateProductStock(req.params.id, dto);
  res.status(200).json(product);
});

// PUT /api/products/:id  (admin only) — full update
export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const dto: ProductFullUpdateDto = {
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
export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.deleteProduct(req.params.id);
  res.status(200).json(result);
});
