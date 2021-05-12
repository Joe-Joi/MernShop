import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getTopProducts,
  getMySellingProducts,
  updateProductStatus,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/myproducts').get(protect, getMySellingProducts);
router.route('/update/status/:id').put(protect, updateProductStatus);
// router.put('/update/status/:id', updateProductStatus);
router.route('/').get(getProducts);
router.route('/new').post(protect, createProduct);

router.get('/top', getTopProducts);
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, deleteProduct)
  .put(protect, updateProduct);

export default router;
