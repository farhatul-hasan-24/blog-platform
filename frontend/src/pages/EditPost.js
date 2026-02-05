import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsAPI } from '../utils/apiService';
import './EditPost.css';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPost(id);
      const post = response.data.data;
      setFormData({
        title: post.title,
        content: post.content
      });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await postsAPI.updatePost(id, formData);
      navigate('/my-posts');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-post-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-post-page">
      <div className="container">
        <div className="edit-post-header">
          <div className="header-content">
            <div className="header-text">
              <h1>✏️ Edit Blog Post</h1>
              <p>Update your content and save changes</p>
            </div>
            <Link to="/my-posts" className="btn-back">
              ← Back to My Posts
            </Link>
          </div>
        </div>

        <div className="edit-post-card">
          {error && (
            <div className="alert alert-error">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="edit-post-form">
            <div className="form-group">
              <label htmlFor="title">Post Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter your post title..."
                required
                maxLength={200}
                disabled={submitting}
              />
              <span className="char-count">{formData.title.length}/200</span>
            </div>

            <div className="form-group">
              <label htmlFor="content">Post Content *</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your post content..."
                required
                rows={15}
                disabled={submitting}
              />
              <span className="char-count">{formData.content.length} characters</span>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/my-posts')}
                className="btn-cancel"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-small"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    💾 Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
