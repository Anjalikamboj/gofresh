import { Schema, model, Document, Types } from 'mongoose';

// ─── Mongoose Document Interface ──────────────────────────────────────────────

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  full_name: string;
  hashed_password: string;
  role: 'user' | 'admin';
  created_at: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    hashed_password: {
      type: String,
      required: true,
      // Never return in queries by default — use .select('+hashed_password') when needed
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    created_at: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    // Disable the default Mongoose _id virtual so we control serialisation via
    // the toJSON transform below (mirrors Python serialize_doc behaviour).
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret['id'] = (ret['_id'] as Types.ObjectId).toString();
        delete ret['_id'];
        delete ret['__v'];
        // hashed_password is select:false so it normally won't be here,
        // but guard defensively in case it was explicitly selected.
        delete ret['hashed_password'];
        return ret;
      },
    },
    timestamps: false, // we manage created_at ourselves to mirror Python
  },
);

export const UserModel = model<IUser>('User', userSchema, 'users');
