import express from 'express';
import { protect } from '../controllers/authController.js';
import {
  createUser,
  deleteMe,
  deleteUser,
  getAllUsers,
  getMe,
  getUser,
  updateMe,
  updateUser,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
