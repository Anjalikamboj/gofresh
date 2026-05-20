import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import * as subscriptionController from './subscription.controller';

const router = Router();

// All subscription routes require authentication
router.get('/', authMiddleware, subscriptionController.listSubscriptions);
router.get('/:id', authMiddleware, subscriptionController.getSubscription);
router.post('/', authMiddleware, subscriptionController.createSubscription);
router.patch('/:id', authMiddleware, subscriptionController.updateSubscription);
router.delete('/:id', authMiddleware, subscriptionController.deleteSubscription);

export default router;
