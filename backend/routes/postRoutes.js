const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
  getDailyPostCounts,
  toggleLike,
  ratePost
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

// Validation rules
const postValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long')
];

// Protected routes - must come BEFORE :id routes
router.post('/', protect, postValidation, handleValidationErrors, createPost);

// Specific sub-routes for posts
router.get('/stats/daily-counts', protect, getDailyPostCounts);
router.get('/user/:userId', protect, getUserPosts);

// Post engagement routes - specific paths before generic :id
router.post('/:id/like', protect, toggleLike);
router.post('/:id/rate', protect, ratePost);
router.put('/:id', protect, postValidation, handleValidationErrors, updatePost);
router.delete('/:id', protect, deletePost);

// Generic routes - LAST so they don't interfere with specific routes
router.get('/', getAllPosts);
router.get('/:id', getPost);

module.exports = router;
