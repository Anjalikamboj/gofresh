import { Router, Request, Response } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import productRoutes from '../modules/products/product.routes';
import subscriptionRoutes from '../modules/subscriptions/subscription.routes';
import orderRoutes from '../modules/orders/order.routes';
import adminUserRoutes from '../modules/users/users.routes';
import schedulerRoutes from '../modules/scheduler/scheduler.routes';

const router = Router();

// ── Module routes ─────────────────────────────────────────────────────────────
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminUserRoutes);
router.use('/scheduler', schedulerRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', service: 'KhetiSe API' });
});

export default router;
