import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getTopProducts,
  getMyProducts,
  updateProductStatus,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/myproducts').get(protect, getMyProducts);
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
