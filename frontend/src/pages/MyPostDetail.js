import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsAPI } from '../utils/apiService';
import './MyPostDetail.css';

const MyPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPost(id);
      setPost(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      await postsAPI.deletePost(id);
      navigate('/my-posts');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post');
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
      <div className="my-post-detail">
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
      <div className="my-post-detail">
        <div className="container">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2>Error Loading Post</h2>
            <p>{error}</p>
            <Link to="/my-posts" className="btn-back">
              ← Back to My Posts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-post-detail">
      <div className="container">
        {/* Header */}
        <div className="detail-header">
          <Link to="/my-posts" className="btn-back-small">
            ← Back to My Posts
          </Link>
        </div>

        {/* Post Content */}
        <div className="post-content-card">
          {/* Post Header */}
          <div className="post-header">
            <div className="post-meta">
              <div className="author-section">
                <div className="author-avatar-large">
                  {post.authorName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="author-details">
                  <span className="author-name">{post.authorName || 'You'}</span>
                  <span className="post-date">📅 {formatDate(post.createdAt)}</span>
                </div>
              </div>
              <div className="post-actions-header">
                <button onClick={() => navigate(`/my-posts/edit/${id}`)} className="btn-edit-large">
                  ✏️ Edit Post
                </button>
                <button onClick={handleDelete} className="btn-delete-large">
                  🗑️ Delete Post
                </button>
              </div>
            </div>
            
            <h1 className="post-title">{post.title}</h1>
            
            {post.updatedAt !== post.createdAt && (
              <div className="updated-info">
                ✏️ Last updated: {formatDate(post.updatedAt)}
              </div>
            )}
          </div>

          {/* Post Body */}
          <div className="post-body">
            <div className="post-content">
              {post.content}
            </div>
          </div>

          {/* Post Footer */}
          <div className="post-footer">
            <div className="post-id">
              <strong>Post ID:</strong> <code>{post._id}</code>
            </div>
            <div className="post-stats">
              <span className="stat-item">
                📝 Created: {new Date(post.createdAt).toLocaleDateString()}
              </span>
              {post.updatedAt !== post.createdAt && (
                <span className="stat-item">
                  ✏️ Modified: {new Date(post.updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPostDetail;
