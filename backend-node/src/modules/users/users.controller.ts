import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import * as usersService from './users.service';

// GET /api/admin/users?page=1&page_size=10
export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(String(req.query.page ?? '1'), 10);
  const page_size = parseInt(String(req.query.page_size ?? '10'), 10);
  const result = await usersService.getAllUsers(page, page_size);
  res.status(200).json(result);
});
