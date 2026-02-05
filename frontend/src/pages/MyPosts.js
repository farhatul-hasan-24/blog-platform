import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../utils/apiService';
import './MyPosts.css';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getUserPosts(user._id);
      setPosts(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load your posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      await postsAPI.deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="my-posts-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-posts-page">
      <div className="container">
        {/* Header */}
        <div className="my-posts-header">
          <div className="header-content">
            <div className="header-text">
              <h1>📝 My Blog Posts</h1>
              <p>Manage and view all your published content</p>
            </div>
            <Link to="/dashboard" className="btn-back">
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Stats & Search Bar */}
        <div className="posts-controls">
          <div className="posts-stats-card">
            <div className="stat-item-mini">
              <span className="stat-icon-mini">📚</span>
              <div className="stat-content-mini">
                <span className="stat-value-mini">{posts.length}</span>
                <span className="stat-label-mini">Total Posts</span>
              </div>
            </div>
            <div className="stat-item-mini">
              <span className="stat-icon-mini">📅</span>
              <div className="stat-content-mini">
                <span className="stat-value-mini">{filteredPosts.length}</span>
                <span className="stat-label-mini">Showing</span>
              </div>
            </div>
          </div>
          
          <div className="search-bar-section">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search your posts by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="no-posts">
            <div className="no-posts-icon">
              {searchTerm ? '🔍' : '✍️'}
            </div>
            <h3>{searchTerm ? 'No posts found' : 'No posts yet'}</h3>
            <p>
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : "You haven't created any posts yet. Go to your dashboard to create your first post!"}
            </p>
            {!searchTerm && (
              <Link to="/dashboard" className="btn-create">
                Create Your First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="posts-grid">
            {filteredPosts.map(post => (
              <div key={post._id} className="post-card">
                <div className="post-card-header">
                  <h3 className="post-card-title" onClick={() => navigate(`/my-posts/${post._id}`)}>
                    {post.title}
                  </h3>
                  <div className="post-card-date">
                    📅 {formatDate(post.createdAt)}
                  </div>
                </div>
                
                <div className="post-card-content">
                  <p>{truncateText(post.content, 150)}</p>
                </div>
                
                <div className="post-card-footer">
                  <div className="post-card-meta">
                    {post.updatedAt !== post.createdAt && (
                      <span className="updated-badge">✏️ Edited</span>
                    )}
                  </div>
                  <div className="post-card-actions">
                    <button
                      onClick={() => navigate(`/my-posts/${post._id}`)}
                      className="btn-view-post"
                      title="View Post"
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={() => navigate(`/my-posts/edit/${post._id}`)}
                      className="btn-edit-post"
                      title="Edit Post"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="btn-delete-post"
                      title="Delete Post"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;
