import { Types } from 'mongoose';
import { OrderModel, IOrder } from './order.model';
import { ApiError } from '../../utils/ApiError';
import { OrderStatus } from './order.types';

type OrderJSON = ReturnType<IOrder['toJSON']>;

const VALID_STATUSES: OrderStatus[] = ['created', 'blocked', 'delivered', 'cancelled'];

// GET /api/orders  — optionally filtered by user_stub_id query param
// NOTE: Mirrors Python backend exactly — filters by "user_stub_id" field in MongoDB,
// which differs from "user_id". This preserves the original API contract.
export async function listOrders(userStubId?: string): Promise<OrderJSON[]> {
  const query: Record<string, string> = {};
  if (userStubId) {
    query['user_stub_id'] = userStubId;
  }
  const orders = await OrderModel.find(query).sort({ scheduled_for: -1 });
  return orders.map((o) => o.toJSON());
}

// GET /api/orders/:id
export async function getOrder(orderId: string): Promise<OrderJSON> {
  const order = await OrderModel.findById(orderId);
  if (!order) {
    throw ApiError.notFound('Order not found');
  }
  return order.toJSON();
}

// PATCH /api/orders/:id/status  — status passed as query param (mirrors Python)
export async function updateOrderStatus(
  orderId: string,
  status: string,
): Promise<OrderJSON> {
  if (!VALID_STATUSES.includes(status as OrderStatus)) {
    throw ApiError.badRequest('Invalid status');
  }

  const updated = await OrderModel.findByIdAndUpdate(
    orderId,
    { $set: { status } },
    { new: true },
  );
  if (!updated) {
    throw ApiError.notFound('Order not found');
  }
  return updated.toJSON();
}
