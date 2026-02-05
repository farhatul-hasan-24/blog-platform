const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  getUserStats,
  updateProfile
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

// Protected admin routes
router.get('/', protect, admin, getAllUsers);
router.get('/stats/overview', protect, admin, getUserStats);

// Protected user routes
router.put('/profile', protect, updateProfile);
router.get('/:id', protect, getUserById);

module.exports = router;
