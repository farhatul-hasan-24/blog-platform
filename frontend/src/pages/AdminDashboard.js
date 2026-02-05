import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../utils/apiService';
import PostsChart from '../components/PostsChart';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsResponse = await usersAPI.getUserStats();
      setStats(statsResponse.data.data);
    } catch (err) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Admin Control Panel</h1>
              <p>Manage platform content, users, and system analytics</p>
            </div>
            <div className="header-icon">🛡️</div>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading admin data...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="stats-section">
              <h2 className="section-title">Platform Statistics</h2>
              <div className="stats-grid">
                <div className="stat-card total-users">
                  <div className="stat-header">
                    <span className="stat-icon">👥</span>
                    <span className="stat-badge">{stats?.totalUsers || 0}</span>
                  </div>
                  <div className="stat-body">
                    <h3>Total Users</h3>
                    <p>Active accounts on platform</p>
                  </div>
                  <Link to="/admin/users" className="stat-action">
                    Manage Users <span>→</span>
                  </Link>
                </div>

                <div className="stat-card total-posts">
                  <div className="stat-header">
                    <span className="stat-icon">📝</span>
                    <span className="stat-badge">{stats?.totalPosts || 0}</span>
                  </div>
                  <div className="stat-body">
                    <h3>Total Posts</h3>
                    <p>Content published</p>
                  </div>
                  <Link to="/admin/posts" className="stat-action">
                    Manage Posts <span>→</span>
                  </Link>
                </div>

                <div className="stat-card regular-users">
                  <div className="stat-header">
                    <span className="stat-icon">👤</span>
                    <span className="stat-badge">{stats?.regularUsers || 0}</span>
                  </div>
                  <div className="stat-body">
                    <h3>Regular Users</h3>
                    <p>Non-admin accounts</p>
                  </div>
                  <div className="stat-action disabled">
                    {((stats?.regularUsers || 0) / (stats?.totalUsers || 1) * 100).toFixed(0)}% of total
                  </div>
                </div>

                <div className="stat-card admin-count">
                  <div className="stat-header">
                    <span className="stat-icon">⭐</span>
                    <span className="stat-badge">{stats?.totalAdmins || 0}</span>
                  </div>
                  <div className="stat-body">
                    <h3>Admins</h3>
                    <p>System administrators</p>
                  </div>
                  <div className="stat-action disabled">
                    {((stats?.totalAdmins || 0) / (stats?.totalUsers || 1) * 100).toFixed(0)}% of total
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Chart */}
            <PostsChart />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
