import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postsAPI } from '../utils/apiService';
import './ManagePosts.css';

const ManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAllPosts();
      setPosts(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load posts');
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
    post.authorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="manage-posts">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-posts">
      <div className="container">
        {/* Header */}
        <div className="manage-posts-header">
          <div className="header-content">
            <div className="header-text">
              <h1>📝 Manage Blog Posts</h1>
              <p>Review, moderate, and manage all platform content</p>
            </div>
            <Link to="/admin" className="btn-back">
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search posts by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="posts-count">
            Showing {filteredPosts.length} of {posts.length} posts
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Posts Table */}
        {filteredPosts.length === 0 ? (
          <div className="no-posts">
            <div className="no-posts-icon">📚</div>
            <h3>No posts found</h3>
            <p>{searchTerm ? 'Try adjusting your search terms' : 'No blog posts have been published yet'}</p>
          </div>
        ) : (
          <div className="posts-table-wrapper">
            <table className="posts-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th>Preview</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map(post => (
                  <tr key={post._id} className="post-row">
                    <td className="post-title-col">
                      <Link 
                        to={`/admin/posts/${post._id}`}
                        className="post-title-link"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="post-author">
                      <div className="author-info">
                        <div className="author-avatar">
                          {post.authorName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span>{post.authorName || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="post-date">{formatDate(post.createdAt)}</td>
                    <td className="post-preview">
                      {truncateText(post.content, 80)}
                    </td>
                    <td className="post-actions">
                      <button
                        onClick={() => navigate(`/admin/posts/${post._id}`)}
                        className="btn-view"
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="btn-delete"
                        title="Delete Post"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePosts;
