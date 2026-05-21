"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getMe = getMe;
exports.updateProfile = updateProfile;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const env_1 = require("../../config/env");
const ApiError_1 = require("../../utils/ApiError");
const auth_model_1 = require("./auth.model");
// ─── Token helpers ────────────────────────────────────────────────────────────
function createAccessToken(email, userId, role) {
    const payload = {
        sub: email,
        user_id: userId,
        role,
    };
    return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET_KEY, {
        expiresIn: env_1.env.ACCESS_TOKEN_EXPIRE_SECONDS,
    });
}
// ─── Service ─────────────────────────────────────────────────────────────────
async function registerUser(dto) {
    if (dto.password.length < 6) {
        throw ApiError_1.ApiError.badRequest('Password must be at least 6 characters long');
    }
    const existing = await auth_model_1.UserModel.findOne({ email: dto.email });
    if (existing) {
        throw ApiError_1.ApiError.badRequest('Email already registered');
    }
    const hashed_password = await bcryptjs_1.default.hash(dto.password, 10);
    const user = await auth_model_1.UserModel.create({
        email: dto.email,
        full_name: dto.full_name,
        hashed_password,
        role: 'user',
        created_at: new Date(),
    });
    const access_token = createAccessToken(user.email, user._id.toString(), user.role);
    return {
        user: user.toJSON(),
        access_token,
        token_type: 'bearer',
    };
}
async function loginUser(dto) {
    // Explicitly select hashed_password which is excluded by default
    const user = await auth_model_1.UserModel.findOne({ email: dto.email }).select('+hashed_password');
    if (!user) {
        throw ApiError_1.ApiError.unauthorized('Incorrect email or password');
    }
    const passwordMatch = await bcryptjs_1.default.compare(dto.password, user.hashed_password);
    if (!passwordMatch) {
        throw ApiError_1.ApiError.unauthorized('Incorrect email or password');
    }
    const access_token = createAccessToken(user.email, user._id.toString(), user.role);
    return {
        user: user.toJSON(),
        access_token,
        token_type: 'bearer',
    };
}
async function getMe(userId) {
    const user = await auth_model_1.UserModel.findById(userId);
    if (!user) {
        throw ApiError_1.ApiError.notFound('User not found');
    }
    return user.toJSON();
}
async function updateProfile(userId, dto) {
    const user = await auth_model_1.UserModel.findById(userId).select('+hashed_password');
    if (!user) {
        throw ApiError_1.ApiError.notFound('User not found');
    }
    const updates = {};
    if (dto.full_name !== undefined) {
        updates.full_name = dto.full_name;
    }
    if (dto.email !== undefined && dto.email !== user.email) {
        const existing = await auth_model_1.UserModel.findOne({ email: dto.email });
        if (existing) {
            throw ApiError_1.ApiError.badRequest('Email already in use');
        }
        updates.email = dto.email;
    }
    if (dto.new_password !== undefined) {
        if (!dto.current_password) {
            throw ApiError_1.ApiError.badRequest('Current password required to set new password');
        }
        const passwordMatch = await bcryptjs_1.default.compare(dto.current_password, user.hashed_password);
        if (!passwordMatch) {
            throw new ApiError_1.ApiError(401, 'Current password is incorrect');
        }
        if (dto.new_password.length < 6) {
            throw ApiError_1.ApiError.badRequest('New password must be at least 6 characters');
        }
        updates.hashed_password = await bcryptjs_1.default.hash(dto.new_password, 10);
    }
    if (Object.keys(updates).length === 0) {
        throw ApiError_1.ApiError.badRequest('No update data provided');
    }
    await auth_model_1.UserModel.updateOne({ _id: new mongoose_1.Types.ObjectId(userId) }, { $set: updates });
    const updated = await auth_model_1.UserModel.findById(userId);
    if (!updated) {
        throw ApiError_1.ApiError.notFound('User not found');
    }
    return updated.toJSON();
}
//# sourceMappingURL=auth.service.js.map