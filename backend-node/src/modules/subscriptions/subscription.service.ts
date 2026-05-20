import { Types } from 'mongoose';
import { SubscriptionModel, ISubscription } from './subscription.model';
import { ProductModel } from '../products/product.model';
import { ApiError } from '../../utils/ApiError';
import {
  SubscriptionCreateDto,
  SubscriptionUpdateDto,
} from './subscription.types';

type SubscriptionJSON = ReturnType<ISubscription['toJSON']>;

// GET /api/subscriptions
export async function listSubscriptions(userId: string): Promise<SubscriptionJSON[]> {
  const subscriptions = await SubscriptionModel.find({ user_id: userId });
  return subscriptions.map((s) => s.toJSON());
}

// GET /api/subscriptions/:id
export async function getSubscription(
  subscriptionId: string,
  userId: string,
): Promise<SubscriptionJSON> {
  const subscription = await SubscriptionModel.findOne({
    _id: new Types.ObjectId(subscriptionId),
    user_id: userId,
  });
  if (!subscription) {
    throw ApiError.notFound('Subscription not found');
  }
  return subscription.toJSON();
}

// POST /api/subscriptions
export async function createSubscription(
  userId: string,
  dto: SubscriptionCreateDto,
): Promise<SubscriptionJSON> {
  if (!['daily', 'weekly'].includes(dto.frequency)) {
    throw ApiError.badRequest('Frequency must be "daily" or "weekly"');
  }

  // Verify all products exist (mirrors Python validation)
  for (const item of dto.items) {
    const product = await ProductModel.findOne({ sku: item.sku });
    if (!product) {
      throw ApiError.badRequest(`Product ${item.sku} not found`);
    }
  }

  const start_date = dto.start_date ? new Date(dto.start_date) : new Date();

  const subscription = await SubscriptionModel.create({
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
export async function updateSubscription(
  subscriptionId: string,
  userId: string,
  dto: SubscriptionUpdateDto,
): Promise<SubscriptionJSON> {
  // Verify ownership
  const existing = await SubscriptionModel.findOne({
    _id: new Types.ObjectId(subscriptionId),
    user_id: userId,
  });
  if (!existing) {
    throw ApiError.notFound('Subscription not found');
  }

  const updateData: Partial<ISubscription> = {};
  if (dto.status !== undefined) updateData.status = dto.status;
  if (dto.items !== undefined) updateData.items = dto.items;
  if (dto.frequency !== undefined) updateData.frequency = dto.frequency;

  if (Object.keys(updateData).length === 0) {
    throw ApiError.badRequest('No update data provided');
  }

  const updated = await SubscriptionModel.findByIdAndUpdate(
    subscriptionId,
    { $set: updateData },
    { new: true },
  );
  if (!updated) {
    throw ApiError.notFound('Subscription not found');
  }
  return updated.toJSON();
}

// DELETE /api/subscriptions/:id
export async function deleteSubscription(
  subscriptionId: string,
  userId: string,
): Promise<{ message: string }> {
  const result = await SubscriptionModel.deleteOne({
    _id: new Types.ObjectId(subscriptionId),
    user_id: userId,
  });
  if (result.deletedCount === 0) {
    throw ApiError.notFound('Subscription not found');
  }
  return { message: 'Subscription deleted successfully' };
}
