import express from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
import {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
  toggleCarAvailability,
  getCarStatistics,
  getUniqueBrands,
} from '../controllers/carController.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/brands', getUniqueBrands);
router.get('/', getAllCars);
router.get('/:id', getCarById);

// Protect all routes after this middleware
router.use(protect);

// Admin only routes
router.use(restrictTo('admin'));
router.post('/', createCar);
router.patch('/:id', updateCar);
router.patch('/:id/toggle-availability', toggleCarAvailability);
router.delete('/:id', deleteCar);
router.get('/statistics', getCarStatistics);

export default router;
