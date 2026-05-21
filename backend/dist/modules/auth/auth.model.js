"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
// ─── Schema ───────────────────────────────────────────────────────────────────
const userSchema = new mongoose_1.Schema({
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
}, {
    // Disable the default Mongoose _id virtual so we control serialisation via
    // the toJSON transform below (mirrors Python serialize_doc behaviour).
    toJSON: {
        transform(_doc, ret) {
            ret['id'] = ret['_id'].toString();
            delete ret['_id'];
            delete ret['__v'];
            // hashed_password is select:false so it normally won't be here,
            // but guard defensively in case it was explicitly selected.
            delete ret['hashed_password'];
            return ret;
        },
    },
    timestamps: false, // we manage created_at ourselves to mirror Python
});
exports.UserModel = (0, mongoose_1.model)('User', userSchema, 'users');
//# sourceMappingURL=auth.model.js.map