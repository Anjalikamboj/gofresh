import { UserModel } from '../auth/auth.model';
import { ApiError } from '../../utils/ApiError';

export interface PaginatedUsers {
  items: ReturnType<(typeof UserModel.prototype)['toJSON']>[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export async function getAllUsers(
  page: number,
  page_size: number,
): Promise<PaginatedUsers> {
  // Clamp pagination parameters (mirrors Python validation)
  if (page < 1) page = 1;
  if (page_size < 1 || page_size > 100) page_size = 10;

  const skip = (page - 1) * page_size;
  const total = await UserModel.countDocuments({});
  const total_pages = Math.ceil(total / page_size);

  const users = await UserModel.find({})
    .sort({ created_at: -1 }) // Newest first
    .skip(skip)
    .limit(page_size);

  return {
    items: users.map((u) => u.toJSON()),
    page,
    page_size,
    total,
    total_pages,
  };
}
