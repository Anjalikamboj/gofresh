import { Types } from 'mongoose';
import { ProductModel, IProduct } from './product.model';
import { ApiError } from '../../utils/ApiError';
import {
  ProductCreateDto,
  ProductStockUpdateDto,
  ProductFullUpdateDto,
} from './product.types';

type ProductJSON = ReturnType<IProduct['toJSON']>;

// GET /api/products
export async function listProducts(): Promise<ProductJSON[]> {
  const products = await ProductModel.find({});
  return products.map((p) => p.toJSON());
}

// GET /api/products/:id
export async function getProduct(productId: string): Promise<ProductJSON> {
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw ApiError.notFound('Product not found');
  }
  return product.toJSON();
}

// POST /api/products  (admin only)
export async function createProduct(dto: ProductCreateDto): Promise<ProductJSON> {
  try {
    const product = await ProductModel.create({
      ...dto,
      created_at: new Date(),
    });
    return product.toJSON();
  } catch (err: unknown) {
    const e = err as Error;
    if (e.message?.includes('duplicate key') || (e as { code?: number }).code === 11000) {
      throw ApiError.badRequest('Product SKU already exists');
    }
    throw ApiError.internal(e.message);
  }
}

// PATCH /api/products/:id  (admin only) — stock update only
export async function updateProductStock(
  productId: string,
  dto: ProductStockUpdateDto,
): Promise<ProductJSON> {
  const result = await ProductModel.findByIdAndUpdate(
    productId,
    { $set: { stock_on_hand: dto.stock_on_hand } },
    { new: true },
  );
  if (!result) {
    throw ApiError.notFound('Product not found');
  }
  return result.toJSON();
}

// PUT /api/products/:id  (admin only) — full partial update
export async function updateProduct(
  productId: string,
  dto: ProductFullUpdateDto,
): Promise<ProductJSON> {
  const existing = await ProductModel.findById(productId);
  if (!existing) {
    throw ApiError.notFound('Product not found');
  }

  // Build update dict with only provided fields (mirrors Python logic)
  const updateData: Partial<IProduct> = {};
  if (dto.name !== undefined) updateData.name = dto.name;
  if (dto.unit !== undefined) updateData.unit = dto.unit;
  if (dto.price !== undefined) updateData.price = dto.price;
  if (dto.stock_on_hand !== undefined) updateData.stock_on_hand = dto.stock_on_hand;
  if (dto.image_url !== undefined) updateData.image_url = dto.image_url;
  if (dto.description !== undefined) updateData.description = dto.description;
  if (dto.benefits !== undefined) updateData.benefits = dto.benefits;
  if (dto.storage !== undefined) updateData.storage = dto.storage;

  if (Object.keys(updateData).length === 0) {
    throw ApiError.badRequest('No fields to update');
  }

  const updated = await ProductModel.findByIdAndUpdate(
    productId,
    { $set: updateData },
    { new: true },
  );
  if (!updated) {
    throw ApiError.notFound('Product not found');
  }
  return updated.toJSON();
}

// DELETE /api/products/:id  (admin only)
export async function deleteProduct(
  productId: string,
): Promise<{ message: string; id: string }> {
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  // Lazy import to avoid circular dependency
  const { SubscriptionModel } = await import('../subscriptions/subscription.model');

  const activeSubscriptions = await SubscriptionModel.countDocuments({
    'items.product_id': productId,
    status: 'active',
  });

  if (activeSubscriptions > 0) {
    throw ApiError.badRequest(
      `Cannot delete product. It is used in ${activeSubscriptions} active subscription(s)`,
    );
  }

  await ProductModel.deleteOne({ _id: new Types.ObjectId(productId) });

  return { message: 'Product deleted successfully', id: productId };
}
