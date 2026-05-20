import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import * as orderService from './order.service';

// GET /api/orders?user_stub_id=...
export const listOrders = catchAsync(async (req: Request, res: Response) => {
  const userStubId = req.query.user_stub_id as string | undefined;
  const orders = await orderService.listOrders(userStubId);
  res.status(200).json(orders);
});

// GET /api/orders/:id
export const getOrder = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.getOrder(req.params.id);
  res.status(200).json(order);
});

// PATCH /api/orders/:id/status?status=delivered
export const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  // status is a query parameter (mirrors FastAPI behaviour for simple type params)
  const status = req.query.status as string;
  const order = await orderService.updateOrderStatus(req.params.id, status);
  res.status(200).json(order);
});
