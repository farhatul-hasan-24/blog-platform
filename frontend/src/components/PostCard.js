import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './PostCard.css';

const PostCard = ({ post, onDelete, showActions = true }) => {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const canDelete = user && (post.author?._id === user._id || isAdmin());
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateTitle = (text) => {
    // Show full title without truncation
    return text || '';
  };

  const truncateContent = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getLikesCount = () => {
    return post.postLikes?.length || 0;
  };

  const getAverageRating = () => {
    if (!post.ratings || post.ratings.length === 0) return 0;
    const total = post.ratings.reduce((sum, r) => sum + r.value, 0);
    return (total / post.ratings.length).toFixed(1);
  };

  const getRatingsCount = () => {
    return post.ratings?.length || 0;
  };

  const handleReadMore = () => {
    if (isAuthenticated()) {
      // If authenticated, navigate to full post view (you can create this route later)
      navigate(`/posts/${post._id}`);
    } else {
      // If not authenticated, redirect to login with return URL
      navigate('/login', { state: { from: `/posts/${post._id}` } });
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-header-content">
          <div className="post-title" title={post.title}>{truncateTitle(post.title)}</div>
          <p className="post-meta">
            <span className="author-name" onClick={() => navigate(`/profile/${post.author?._id}`)}>
              {post.authorName || post.author?.username}
            </span>
            <span className="meta-separator"> • </span>
            <span className="post-date">{formatDate(post.createdAt)}</span>
          </p>
        </div>
        
      </div>
      <p className="post-content">{truncateContent(post.content)}</p>
      <div className="post-engagement">
        <div className="engagement-stat">
          <span className="engagement-icon">❤️</span>
          <span className="engagement-text">{getLikesCount()} Like{getLikesCount() !== 1 ? 's' : ''}</span>
        </div>
        {getRatingsCount() > 0 && (
          <div className="engagement-stat">
            <span className="engagement-icon">⭐</span>
            <span className="engagement-text">{getAverageRating()} ({getRatingsCount()} rating{getRatingsCount() !== 1 ? 's' : ''})</span>
          </div>
        )}
      </div>
      <div className="post-footer">
        <button onClick={handleReadMore} className="btn-read-more">
          📖 Read More
        </button>
      </div>
    </div>
  );
};

export default PostCard;
