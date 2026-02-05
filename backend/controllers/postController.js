const Post = require('../models/Post');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username email');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message
    });
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.create({
      title,
      content,
      author: req.user._id,
      authorName: req.user.username
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Owner only)
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    const { title, content } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;

    const updatedPost = await post.save();

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating post',
      error: error.message
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Owner or Admin)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is owner or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
};

// @desc    Toggle like on a post
// @route   POST /api/posts/:id/like
// @access  Private
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (!post.postLikes) post.postLikes = [];
    const userId = req.user._id.toString();
    const likeIndex = post.postLikes.findIndex((id) => id.toString() === userId);

    let liked = false;
    if (likeIndex >= 0) {
      post.postLikes.splice(likeIndex, 1);
    } else {
      post.postLikes.push(req.user._id);
      liked = true;
    }

    await post.save();

    res.json({
      success: true,
      data: {
        likes: post.postLikes.length,
        liked
      }
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling like',
      error: error.message
    });
  }
};

// @desc    Rate a post
// @route   POST /api/posts/:id/rate
// @access  Private
exports.ratePost = async (req, res) => {
  try {
    const { value } = req.body;
    const ratingValue = Number(value);

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating value must be between 1 and 5'
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (!post.ratings) post.ratings = [];
    const userId = req.user._id.toString();
    const ratingIndex = post.ratings.findIndex(
      (rating) => rating.user.toString() === userId
    );
    if (ratingIndex >= 0) {
      post.ratings[ratingIndex].value = ratingValue;
    } else {
      post.ratings.push({ user: req.user._id, value: ratingValue });
    }

    await post.save();

    const total = post.ratings.reduce((sum, r) => sum + r.value, 0);
    const average = post.ratings.length ? total / post.ratings.length : 0;

    res.json({
      success: true,
      data: {
        averageRating: Number(average.toFixed(2)),
        ratingsCount: post.ratings.length,
        userRating: ratingValue
      }
    });
  } catch (error) {
    console.error('Rate post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rating post',
      error: error.message
    });
  }
};

// @desc    Get posts by user
// @route   GET /api/posts/user/:userId
// @access  Private
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'username email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user posts',
      error: error.message
    });
  }
};

// @desc    Get daily blog post counts
// @route   GET /api/posts/stats/daily-counts
// @access  Private/Admin
exports.getDailyPostCounts = async (req, res) => {
  try {
    // Get posts from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Aggregate posts by date, using dateToString to handle timezone consistently
    const dailyCounts = await Post.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Fill in missing dates with 0 posts
    const dateMap = new Map();
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, 0);
    }

    // Populate actual counts
    dailyCounts.forEach(item => {
      dateMap.set(item._id, item.count);
    });

    // Convert to array and sort
    const chartData = Array.from(dateMap.entries())
      .map(([date, count]) => ({
        date,
        count,
        displayDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      success: true,
      data: chartData
    });
  } catch (error) {
    console.error('Get daily post counts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching daily post counts',
      error: error.message
    });
  }
};
