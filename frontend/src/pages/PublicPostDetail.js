import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsAPI, commentsAPI } from '../utils/apiService';
import { useAuth } from '../context/AuthContext';
import './PublicPostDetail.css';

const PublicPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likesCount, setLikesCount] = useState(0);
  const [likedByMe, setLikedByMe] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingsCount, setRatingsCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (post) {
      syncEngagementState(post);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, post]);

  const syncEngagementState = (postData) => {
    setLikesCount(postData.postLikes?.length || 0);
    setLikedByMe(
      !!postData.postLikes?.find((likeId) => likeId?.toString() === user?._id?.toString())
    );
    setComments(postData.comments || []);

    const ratings = postData.ratings || [];
    const total = ratings.reduce((sum, r) => sum + r.value, 0);
    const avg = ratings.length ? total / ratings.length : 0;
    setAverageRating(Number(avg.toFixed(2)));
    setRatingsCount(ratings.length);
    const myRating = ratings.find(
      (r) => r.user?.toString() === user?._id?.toString()
    );
    setUserRating(myRating ? myRating.value : 0);
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPost(id);
      const postData = response.data.data;
      setPost(postData);
      syncEngagementState(postData);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async () => {
    if (!user?._id) {
      navigate('/login');
      return;
    }
    try {
      await postsAPI.toggleLike(id);
      await fetchPost();
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleRate = async (value) => {
    setUserRating(value);
    try {
      const response = await postsAPI.ratePost(id, value);
      setAverageRating(response.data.data.averageRating);
      setRatingsCount(response.data.data.ratingsCount);
      setUserRating(response.data.data.userRating);
    } catch (err) {
      console.error('Rate error:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user?._id) {
      navigate('/login');
      return;
    }

    try {
      setCommentError('');
      setCommentLoading(true);
      await commentsAPI.addComment(id, commentText.trim());
      setCommentText('');
      await fetchPost();
    } catch (err) {
      console.error('Comment error:', err);
      setCommentError(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleToggleCommentLike = async (commentId) => {
    if (!user?._id) {
      navigate('/login');
      return;
    }
    const hasLiked = comments.find((c) => c._id === commentId)?.commentLikes?.some(
      (uid) => uid?.toString() === user?._id?.toString()
    );
    setComments((prev) =>
      prev.map((comment) => {
        if (comment._id !== commentId) return comment;
        const currentLikes = comment.commentLikes || [];
        const updatedLikes = hasLiked
          ? currentLikes.filter((uid) => uid?.toString() !== user?._id?.toString())
          : [...currentLikes, user._id];
        return {
          ...comment,
          commentLikes: updatedLikes
        };
      })
    );

    try {
      const response = await commentsAPI.toggleCommentLike(id, commentId);
      const { likes, liked } = response.data.data;

      setComments((prev) =>
        prev.map((comment) => {
          if (comment._id !== commentId) return comment;

          const currentLikes = comment.commentLikes || [];
          const updatedLikes = liked
            ? [...currentLikes, user._id]
            : currentLikes.filter((uid) => uid?.toString() !== user._id?.toString());

          return {
            ...comment,
            commentLikes: updatedLikes,
            likesCount: likes
          };
        })
      );
    } catch (err) {
      console.error('Comment like error:', err);
      // revert optimistic update
      setComments((prev) =>
        prev.map((comment) => {
          if (comment._id !== commentId) return comment;
          const currentLikes = comment.commentLikes || [];
          const updatedLikes = hasLiked
            ? [...currentLikes, user._id]
            : currentLikes.filter((uid) => uid?.toString() !== user?._id?.toString());
          return {
            ...comment,
            commentLikes: updatedLikes
          };
        })
      );
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="public-post-detail">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-post-detail">
        <div className="container">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2>Error Loading Post</h2>
            <p>{error}</p>
            <Link to="/" className="btn-back">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="public-post-detail">
      <div className="container">
        {/* Header */}
        <div className="detail-header">
          <Link to="/" className="btn-back-small">
            ← Back to Home
          </Link>
        </div>

        {/* Post Content */}
        <div className="post-content-card">
          {/* Post Header Section */}
          <div className="post-header-section">
            <div className="post-header-top">
              <h1 className="post-title">{post.title}</h1>
            </div>
            
            <div className="post-metadata">
              <div className="author-info">
                <div className="author-avatar-large">
                  {post.authorName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="author-details">
                  <span className="author-name">{post.authorName || 'Anonymous'}</span>
                  <span className="post-date">📅 {formatDate(post.createdAt)}</span>
                  {post.updatedAt !== post.createdAt && (
                    <span className="updated-info">✏️ Updated: {formatDate(post.updatedAt)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Post Divider */}
          <div className="post-divider"></div>

          {/* Post Body */}
          <div className="post-body">
            <div className="post-content">{post.content}</div>
          </div>

          {/* Post Actions */}
          <div className="post-actions">
            <button
              type="button"
              className={`action-btn like-btn ${likedByMe ? 'active' : ''}`}
              onClick={handleToggleLike}
            >
              {likedByMe ? '❤️' : '🤍'} Like ({likesCount})
            </button>

            <div className="rating-section">
              <span className="rating-label">Rate:</span>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`star ${value <= userRating ? 'filled' : ''}`}
                    onClick={() => handleRate(value)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <span className="rating-info">
                {averageRating} ({ratingsCount})
              </span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="comments-section">
            <h3 className="comments-title">Comments ({comments.length})</h3>

            <form className="comment-form" onSubmit={handleAddComment}>
              <textarea
                className="comment-input"
                rows="3"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                maxLength="500"
              />
              {commentError && <div className="comment-error">{commentError}</div>}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={commentLoading}
                onClick={handleAddComment}
              >
                {commentLoading ? 'Posting...' : 'Post Comment'}
              </button>
            </form>

            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="no-comments">No comments yet. Be the first to comment.</p>
              ) : (
                comments.map((comment, index) => (
                  <div key={comment._id || index} className="comment-item">
                    <div className="comment-avatar">
                      {comment.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-username">{comment.username}</span>
                        <span className="comment-date">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                      <div className="comment-actions">
                        <button
                          type="button"
                          className={`comment-like-btn ${
                            comment.commentLikes?.some(
                              (uid) => uid?.toString() === user?._id?.toString()
                            )
                              ? 'active'
                              : ''
                          }`}
                          onClick={() => handleToggleCommentLike(comment._id)}
                        >
                          {comment.commentLikes?.some(
                            (uid) => uid?.toString() === user?._id?.toString()
                          )
                            ? '❤️'
                            : '🤍'}{' '}
                          {comment.commentLikes?.length || 0}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPostDetail;
