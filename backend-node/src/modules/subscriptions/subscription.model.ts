import { Schema, model, Document, Types } from 'mongoose';

// ─── Sub-document interface ───────────────────────────────────────────────────

export interface ISubscriptionItem {
  sku: string;
  quantity: number;
}

// ─── Mongoose Document Interface ──────────────────────────────────────────────

export interface ISubscription extends Document {
  _id: Types.ObjectId;
  user_id: string;
  items: ISubscriptionItem[];
  frequency: 'daily' | 'weekly';
  start_date: Date;
  next_run_at: Date;
  status: 'active' | 'paused';
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

const subscriptionSchema = new Schema<ISubscription>(
  {
    user_id: { type: String, required: true },
    items: { type: [subscriptionItemSchema], required: true },
    frequency: { type: String, enum: ['daily', 'weekly'], required: true },
    start_date: { type: Date, required: true },
    next_run_at: { type: Date, required: true },
    status: { type: String, enum: ['active', 'paused'], default: 'active' },
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

// Mirror Python index: db.subscriptions.create_index([("user_stub_id", ASCENDING)])
// We also add an index on user_id which is the field actually queried
subscriptionSchema.index({ user_id: 1 });
subscriptionSchema.index({ user_stub_id: 1 }); // legacy index from Python DB

export const SubscriptionModel = model<ISubscription>(
  'Subscription',
  subscriptionSchema,
  'subscriptions',
);
