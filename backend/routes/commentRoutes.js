const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  addComment,
  toggleCommentLike,
  deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

// Validation rules
const commentValidation = [
  body('text')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters')
];

// Add comment to a post
router.post('/:postId/comments', protect, commentValidation, handleValidationErrors, addComment);

// Toggle like on a comment
router.post('/:postId/comments/:commentId/like', protect, toggleCommentLike);

// Delete comment
router.delete('/:postId/comments/:commentId', protect, deleteComment);

module.exports = router;
