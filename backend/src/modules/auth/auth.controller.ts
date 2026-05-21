import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import * as authService from './auth.service';
import { UserCreateDto, UserLoginDto, UserUpdateDto } from './auth.types';

// POST /api/auth/register
export const register = catchAsync(async (req: Request, res: Response) => {
  const dto: UserCreateDto = {
    email: req.body.email,
    full_name: req.body.full_name,
    password: req.body.password,
  };
  const result = await authService.registerUser(dto);
  res.status(200).json(result);
});

// POST /api/auth/login
export const login = catchAsync(async (req: Request, res: Response) => {
  const dto: UserLoginDto = {
    email: req.body.email,
    password: req.body.password,
  };
  const result = await authService.loginUser(dto);
  res.status(200).json(result);
});

// GET /api/auth/me
export const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.user_id;
  const user = await authService.getMe(userId);
  res.status(200).json(user);
});

// PATCH /api/auth/profile
export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.user_id;
  const dto: UserUpdateDto = {
    full_name: req.body.full_name,
    email: req.body.email,
    current_password: req.body.current_password,
    new_password: req.body.new_password,
  };
  const updated = await authService.updateProfile(userId, dto);
  res.status(200).json(updated);
});
