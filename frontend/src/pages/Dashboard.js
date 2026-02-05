import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreatePostForm from '../components/CreatePostForm';
import './Dashboard.css';

const Dashboard = () => {
  const [postCount, setPostCount] = useState(0);
  const { user } = useAuth();

  const handlePostCreated = () => {
    setPostCount(postCount + 1);
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div className="header-content">
            <div>
              <h1>👋 Welcome Back, {user?.username}!</h1>
              <p>Create amazing content and manage your blog posts</p>
            </div>
            <Link to="/my-posts" className="btn-view-posts">
              📚 View All My Posts
            </Link>
          </div>
        </div>

        <CreatePostForm onPostCreated={handlePostCreated} />
      </div>
    </div>
  );
};

export default Dashboard;
