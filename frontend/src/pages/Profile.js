import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI, postsAPI } from '../utils/apiService';
import './Profile.css';

const Profile = () => {
  const { user, updateUserContext } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    location: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [postsCount, setPostsCount] = useState(0);
  const [userRank, setUserRank] = useState('New Member');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        avatar: user.avatar || ''
      });
      setAvatarPreview(user.avatar || '');
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      // Fetch user's posts
      const postsResponse = await postsAPI.getUserPosts(user._id);
      const count = postsResponse.data.count || 0;
      setPostsCount(count);
      
      // Calculate user rank based on post count
      const rank = calculateRank(count);
      setUserRank(rank);
    } catch (err) {
      console.error('Failed to fetch user stats:', err);
    }
  };

  const calculateRank = (postCount) => {
    if (postCount >= 0 && postCount <= 4) return 'New Member';
    if (postCount >= 5 && postCount <= 9) return 'Beginner';
    if (postCount >= 10 && postCount <= 24) return 'Contributor';
    if (postCount >= 25 && postCount <= 49) return 'Regular';
    if (postCount >= 50 && postCount <= 69) return 'Expert';
    if (postCount >= 70) return 'Master Writer';
    return 'New Member';
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, avatar: value });
    setAvatarPreview(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await usersAPI.updateProfile(formData);
      setSuccess('Profile updated successfully!');
      if (updateUserContext) {
        updateUserContext(response.data.data);
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your personal information and settings</p>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="avatar-section">
              <div className="avatar-large">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }} />
                ) : null}
                <div className="avatar-placeholder" style={{ display: avatarPreview ? 'none' : 'flex' }}>
                  {formData.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <h3>{formData.username}</h3>
              <p className="user-email">{formData.email}</p>
            </div>

            <div className="profile-stats">
              <div className="stat-box">
                <span className="stat-icon">📝</span>
                <div>
                  <div className="stat-value">{postsCount}</div>
                  <div className="stat-label">Posts</div>
                </div>
              </div>
              <div className="stat-box">
                <span className="stat-icon">🏆</span>
                <div>
                  <div className="stat-value">{userRank}</div>
                  <div className="stat-label">Rank</div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-form-section">
            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-section">
                <h3>Basic Information</h3>
                
                <div className="form-group">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-input"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location" className="form-label">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="form-input"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. New York, USA"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Profile Picture</h3>
                <div className="form-group">
                  <label htmlFor="avatar" className="form-label">Avatar URL</label>
                  <input
                    type="url"
                    id="avatar"
                    name="avatar"
                    className="form-input"
                    value={formData.avatar}
                    onChange={handleAvatarChange}
                    placeholder="https://example.com/avatar.jpg"
                  />
                  <p className="form-hint">Enter a URL to your profile picture</p>
                </div>
              </div>

              <div className="form-section">
                <h3>About</h3>
                <div className="form-group">
                  <label htmlFor="bio" className="form-label">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="form-input"
                    rows="4"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    maxLength="500"
                  />
                  <p className="form-hint">{formData.bio.length}/500 characters</p>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
