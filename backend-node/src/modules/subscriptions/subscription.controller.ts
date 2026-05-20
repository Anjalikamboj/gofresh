import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import * as subscriptionService from './subscription.service';
import { SubscriptionCreateDto, SubscriptionUpdateDto } from './subscription.types';

// GET /api/subscriptions
export const listSubscriptions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.user_id;
  const subscriptions = await subscriptionService.listSubscriptions(userId);
  res.status(200).json(subscriptions);
});

// GET /api/subscriptions/:id
export const getSubscription = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.user_id;
  const subscription = await subscriptionService.getSubscription(
    req.params.id,
    userId,
  );
  res.status(200).json(subscription);
});

// POST /api/subscriptions
export const createSubscription = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.user_id;
  const dto: SubscriptionCreateDto = {
    items: req.body.items,
    frequency: req.body.frequency,
    start_date: req.body.start_date,
  };
  const subscription = await subscriptionService.createSubscription(userId, dto);
  res.status(200).json(subscription);
});

// PATCH /api/subscriptions/:id
export const updateSubscription = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.user_id;
  const dto: SubscriptionUpdateDto = {
    status: req.body.status,
    items: req.body.items,
    frequency: req.body.frequency,
  };
  const subscription = await subscriptionService.updateSubscription(
    req.params.id,
    userId,
    dto,
  );
  res.status(200).json(subscription);
});

// DELETE /api/subscriptions/:id
export const deleteSubscription = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.user_id;
  const result = await subscriptionService.deleteSubscription(req.params.id, userId);
  res.status(200).json(result);
});
