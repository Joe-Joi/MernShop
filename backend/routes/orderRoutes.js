import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  updateOrderToCompleted,
  updateOrderToArranged,
  getMyOrders,
  getOrders,
  getMySoldOrders,
  createOrderReview,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/mysoldorders').get(protect, getMySoldOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/complete').put(protect, updateOrderToCompleted);
router.route('/:id/arrange').put(protect, updateOrderToArranged);
router.route('/:id/reviews').post(protect, createOrderReview);

export default router;
