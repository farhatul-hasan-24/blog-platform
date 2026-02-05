import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postsAPI } from '../utils/apiService';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getAllPosts();
      const postsData = response.data.data;
      
      // Sort posts by average rating (highest first)
      const sortedPosts = postsData.sort((a, b) => {
        const getAvgRating = (post) => {
          if (!post.ratings || post.ratings.length === 0) return 0;
          const total = post.ratings.reduce((sum, r) => sum + r.value, 0);
          return total / post.ratings.length;
        };
        return getAvgRating(b) - getAvgRating(a);
      });
      
      setPosts(sortedPosts);
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postsAPI.deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-shape shape-1"></div>
          <div className="hero-shape shape-2"></div>
          <div className="hero-shape shape-3"></div>
        </div>
        
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Unleash Your <span className="gradient-text">Creativity</span>
              </h1>
              <p className="hero-subtitle">
                Join thousands of writers sharing their stories, expertise, and passion. Your voice matters.
              </p>
              
              <div className="hero-buttons">
                {!isAuthenticated() ? (
                  <>
                    <button 
                      onClick={() => navigate('/register')} 
                      className="btn btn-primary btn-lg"
                    >
                      🚀 Start Writing
                    </button>
                    <button 
                      onClick={() => navigate('/login')} 
                      className="btn btn-secondary btn-lg"
                    >
                      ✍️ Sign In
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => navigate('/dashboard')} 
                    className="btn btn-primary btn-lg"
                  >
                    📝 Create New Post
                  </button>
                )}
              </div>
            </div>
            
            <div className="hero-illustration">
              <div className="floating-card card-1">
                <div className="card-icon">📚</div>
                <p>Discover Stories</p>
              </div>
              <div className="floating-card card-2">
                <div className="card-icon">🌟</div>
                <p>Get Featured</p>
              </div>
              <div className="floating-card card-3">
                <div className="card-icon">💡</div>
                <p>Share Ideas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      {loading ? (
        <section className="loading-section">
          <div className="container">
            <div className="loading">Loading posts</div>
          </div>
        </section>
      ) : posts.length > 0 ? (
        <section className="featured-section">
          <div className="container">
            <div className="section-header">
              <h2>⭐ Most Rated Posts</h2>
              <p>Discover the best content from our writers</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="featured-grid">
              {posts.map((post) => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  onDelete={handleDelete}
                  showActions={true}
                />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="empty-state">
          <div className="container">
            <div className="empty-content">
              <div className="empty-icon">📭</div>
              <h2>No stories yet</h2>
              <p>Be the first to share your story with our community</p>
              {isAuthenticated() ? (
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  ✨ Create Your First Post
                </Link>
              ) : (
                <Link to="/register" className="btn btn-primary btn-lg">
                  🚀 Join Us & Write
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!isAuthenticated() && posts.length > 0 && (
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to share your story?</h2>
              <p>Join our community of writers and start publishing today</p>
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
