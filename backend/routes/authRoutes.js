import express from 'express';
import {
  forgotPassword,
  login,
  protect,
  resetPassword,
  signup,
  updatePassword,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword', protect, updatePassword);

export default router;
