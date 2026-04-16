import express from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  checkCarAvailability,
  getAvailableTimeSlots,
  getUserBookingHistory,
  getBookingStatistics,
  updateBookingStatus,
} from '../controllers/bookingController.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Public routes (authenticated users)
router.get('/check-availability', checkCarAvailability);
router.get('/time-slots', getAvailableTimeSlots);
router.get('/my-bookings', getUserBookingHistory);
router.post('/', createBooking);
router.get('/:id', getBookingById);
router.patch('/:id', updateBooking);
router.patch('/:id/cancel', cancelBooking);

// Admin only routes
router.use(restrictTo('admin'));
router.get('/', getAllBookings);
router.get('/statistics', getBookingStatistics);
router.patch('/:id/status', updateBookingStatus);

export default router;
