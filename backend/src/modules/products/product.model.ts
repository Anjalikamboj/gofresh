import { Schema, model, Document, Types } from 'mongoose';

// ─── Mongoose Document Interface ──────────────────────────────────────────────

export interface IProduct extends Document {
  _id: Types.ObjectId;
  sku: string;
  name: string;
  unit: string;
  price: number;
  stock_on_hand: number;
  image_url?: string;
  // From seed data (not in Python Pydantic model but present in MongoDB)
  images?: string[];
  description?: string;
  long_description?: string;
  benefits?: string[];
  storage?: string;
  created_at: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const productSchema = new Schema<IProduct>(
  {
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
  },
  {
    strict: false, // allow extra fields from seed data to pass through
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

export const ProductModel = model<IProduct>('Product', productSchema, 'products');
