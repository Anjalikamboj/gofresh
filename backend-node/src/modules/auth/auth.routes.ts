import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import * as authController from './auth.controller';

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authMiddleware, authController.getMe);
router.patch('/profile', authMiddleware, authController.updateProfile);

export default router;
