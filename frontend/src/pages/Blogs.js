import React, { useEffect, useState } from 'react';
import { postsAPI } from '../utils/apiService';
import PostCard from '../components/PostCard';
import './Blogs.css';

const Blogs = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getAllPosts();
      setPosts(response.data.data || []);
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredPosts = normalizedQuery
    ? posts.filter((post) => {
        const title = post.title?.toLowerCase() || '';
        const content = post.content?.toLowerCase() || '';
        const author = post.authorName?.toLowerCase() || post.author?.username?.toLowerCase() || '';
        return (
          title.includes(normalizedQuery) ||
          content.includes(normalizedQuery) ||
          author.includes(normalizedQuery)
        );
      })
    : posts;

  return (
    <div className="blogs-page">
      <div className="container">
        <div className="blogs-header">
          <h1>All Blogs</h1>
          <p>Browse every published post in one place</p>
        </div>

        <div className="blogs-search">
          <input
            type="text"
            className="blogs-search-input"
            placeholder="Search by title, author, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading">Loading posts</div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : filteredPosts.length > 0 ? (
          <div className="blogs-grid">
            {filteredPosts.map((post) => (
              <PostCard key={post._id} post={post} showActions={false} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-content">
              <div className="empty-icon">📭</div>
              <h2>No matching posts</h2>
              <p>Try a different search term.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
