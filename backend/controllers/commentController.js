const Post = require('../models/Post');

// @desc    Add comment to a post
// @route   POST /api/comments/:postId/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (!post.comments) post.comments = [];

    const newComment = {
      user: req.user._id,
      username: req.user.username,
      text: text.trim(),
      commentLikes: [],
      createdAt: Date.now()
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({
      success: true,
      data: {
        comment: post.comments[post.comments.length - 1],
        commentsCount: post.comments.length
      }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
};

// @desc    Toggle like on a comment
// @route   POST /api/comments/:postId/comments/:commentId/like
// @access  Private
exports.toggleCommentLike = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (!comment.commentLikes) comment.commentLikes = [];
    const userId = req.user._id.toString();
    const likeIndex = comment.commentLikes.findIndex((uid) => uid.toString() === userId);

    let liked = false;
    if (likeIndex >= 0) {
      comment.commentLikes.splice(likeIndex, 1);
    } else {
      comment.commentLikes.push(req.user._id);
      liked = true;
    }

    await post.save();

    res.json({
      success: true,
      data: {
        commentId,
        likes: comment.commentLikes.length,
        liked
      }
    });
  } catch (error) {
    console.error('Toggle comment like error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling comment like',
      error: error.message
    });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:postId/comments/:commentId
// @access  Private (Author or Admin)
exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is comment author or post author
    if (comment.user.toString() !== req.user._id.toString() && 
        post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    comment.deleteOne();
    await post.save();

    res.json({
      success: true,
      message: 'Comment deleted successfully',
      commentsCount: post.comments.length
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: error.message
    });
  }
};
