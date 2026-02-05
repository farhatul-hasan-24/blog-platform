import React, { useState } from 'react';
import { postsAPI } from '../utils/apiService';
import './CreatePostForm.css';

const CreatePostForm = ({ onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await postsAPI.createPost(formData);
      if (response.data.success) {
        setFormData({ title: '', content: '' });
        onPostCreated(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-form">
      <h2>Create New Post</h2>
      {error && <div className="alert alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-input"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title"
            required
            minLength={3}
            maxLength={200}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea
            id="content"
            name="content"
            className="form-textarea"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your blog post content..."
            required
            minLength={10}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePostForm;
