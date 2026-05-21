import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../../middlewares/auth.middleware';
import * as productController from './product.controller';

const router = Router();

// Public routes
router.get('/', productController.listProducts);
router.get('/:id', productController.getProduct);

// Admin-only routes
router.post('/', authMiddleware, adminMiddleware, productController.createProduct);
router.patch('/:id', authMiddleware, adminMiddleware, productController.updateProductStock);
router.put('/:id', authMiddleware, adminMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

export default router;
