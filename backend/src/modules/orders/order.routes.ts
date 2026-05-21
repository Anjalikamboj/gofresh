import { Router } from 'express';
import * as orderController from './order.controller';

const router = Router();

// Public routes — mirrors Python backend (no auth on order endpoints)
router.get('/', orderController.listOrders);
router.get('/:id', orderController.getOrder);
router.patch('/:id/status', orderController.updateOrderStatus);

export default router;
