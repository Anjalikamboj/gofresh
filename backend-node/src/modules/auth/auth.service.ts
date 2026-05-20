import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { env } from '../../config/env';
import { ApiError } from '../../utils/ApiError';
import { UserModel, IUser } from './auth.model';
import {
  UserCreateDto,
  UserLoginDto,
  UserUpdateDto,
  AuthResponse,
  TokenPayload,
} from './auth.types';

// ─── Token helpers ────────────────────────────────────────────────────────────

function createAccessToken(email: string, userId: string, role: string): string {
  const payload: Omit<TokenPayload, 'exp' | 'iat'> = {
    sub: email,
    user_id: userId,
    role,
  };
  return jwt.sign(payload, env.JWT_SECRET_KEY, {
    expiresIn: env.ACCESS_TOKEN_EXPIRE_SECONDS,
  });
}

// ─── Service ─────────────────────────────────────────────────────────────────

export async function registerUser(dto: UserCreateDto): Promise<AuthResponse> {
  if (dto.password.length < 6) {
    throw ApiError.badRequest('Password must be at least 6 characters long');
  }

  const existing = await UserModel.findOne({ email: dto.email });
  if (existing) {
    throw ApiError.badRequest('Email already registered');
  }

  const hashed_password = await bcrypt.hash(dto.password, 10);

  const user = await UserModel.create({
    email: dto.email,
    full_name: dto.full_name,
    hashed_password,
    role: 'user',
    created_at: new Date(),
  });

  const access_token = createAccessToken(
    user.email,
    (user._id as Types.ObjectId).toString(),
    user.role,
  );

  return {
    user: user.toJSON() as Record<string, unknown>,
    access_token,
    token_type: 'bearer',
  };
}

export async function loginUser(dto: UserLoginDto): Promise<AuthResponse> {
  // Explicitly select hashed_password which is excluded by default
  const user = await UserModel.findOne({ email: dto.email }).select(
    '+hashed_password',
  );

  if (!user) {
    throw ApiError.unauthorized('Incorrect email or password');
  }

  const passwordMatch = await bcrypt.compare(dto.password, user.hashed_password);
  if (!passwordMatch) {
    throw ApiError.unauthorized('Incorrect email or password');
  }

  const access_token = createAccessToken(
    user.email,
    (user._id as Types.ObjectId).toString(),
    user.role,
  );

  return {
    user: user.toJSON() as Record<string, unknown>,
    access_token,
    token_type: 'bearer',
  };
}

export async function getMe(userId: string): Promise<Record<string, unknown>> {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  return user.toJSON() as Record<string, unknown>;
}

export async function updateProfile(
  userId: string,
  dto: UserUpdateDto,
): Promise<Record<string, unknown>> {
  const user = await UserModel.findById(userId).select('+hashed_password');
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const updates: Partial<Pick<IUser, 'full_name' | 'email' | 'hashed_password'>> = {};

  if (dto.full_name !== undefined) {
    updates.full_name = dto.full_name;
  }

  if (dto.email !== undefined && dto.email !== user.email) {
    const existing = await UserModel.findOne({ email: dto.email });
    if (existing) {
      throw ApiError.badRequest('Email already in use');
    }
    updates.email = dto.email;
  }

  if (dto.new_password !== undefined) {
    if (!dto.current_password) {
      throw ApiError.badRequest('Current password required to set new password');
    }
    const passwordMatch = await bcrypt.compare(
      dto.current_password,
      user.hashed_password,
    );
    if (!passwordMatch) {
      throw new ApiError(401, 'Current password is incorrect');
    }
    if (dto.new_password.length < 6) {
      throw ApiError.badRequest('New password must be at least 6 characters');
    }
    updates.hashed_password = await bcrypt.hash(dto.new_password, 10);
  }

  if (Object.keys(updates).length === 0) {
    throw ApiError.badRequest('No update data provided');
  }

  await UserModel.updateOne({ _id: new Types.ObjectId(userId) }, { $set: updates });

  const updated = await UserModel.findById(userId);
  if (!updated) {
    throw ApiError.notFound('User not found');
  }
  return updated.toJSON() as Record<string, unknown>;
}
