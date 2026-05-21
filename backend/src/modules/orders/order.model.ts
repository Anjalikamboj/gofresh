import { Schema, model, Document, Types } from 'mongoose';
import { ISubscriptionItem } from '../subscriptions/subscription.model';
import { OrderStatus, InventoryCheckItem } from './order.types';

// ─── Mongoose Document Interface ──────────────────────────────────────────────

export interface IOrder extends Document {
  _id: Types.ObjectId;
  subscription_id: string;
  user_id: string;
  items: ISubscriptionItem[];
  scheduled_for: Date;
  status: OrderStatus;
  reason?: string;
  inventory_check?: InventoryCheckItem[];
  created_at: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const subscriptionItemSchema = new Schema<ISubscriptionItem>(
  {
    sku: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false },
);

const inventoryCheckSchema = new Schema<InventoryCheckItem>(
  {
    sku: { type: String, required: true },
    required: { type: Number, required: true },
    available: { type: Number, required: true },
  },
  { _id: false },
);

const orderSchema = new Schema<IOrder>(
  {
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
  },
  {
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret['id'] = (ret['_id'] as Types.ObjectId).toString();
        delete ret['_id'];
        delete ret['__v'];
        return ret;
      },
    },
    timestamps: false,
  },
);

// Unique index mirroring Python: db.orders.create_index([(subscription_id, scheduled_for)], unique=True)
orderSchema.index({ subscription_id: 1, scheduled_for: 1 }, { unique: true });

export const OrderModel = model<IOrder>('Order', orderSchema, 'orders');
