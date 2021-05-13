import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  getUserReviews,
  getUserByEmail,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router.route('/profile/reviews/:email').get(protect, getUserReviews);
router.route('/profile/:email').get(getUserProfile);
router.route('/profile/:id').put(protect, updateUserProfile);
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);
router.route('/getUserInfo/:email').get(getUserByEmail);
router.route('/userinfo/:id').get(getUserById);
export default router;
