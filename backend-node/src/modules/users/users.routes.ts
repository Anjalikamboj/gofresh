import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../../middlewares/auth.middleware';
import * as usersController from './users.controller';

const router = Router();

// All admin user routes require auth + admin role
router.get('/users', authMiddleware, adminMiddleware, usersController.getAllUsers);

export default router;
