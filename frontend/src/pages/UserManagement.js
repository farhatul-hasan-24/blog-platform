import React, { useState, useEffect } from 'react';
import { usersAPI } from '../utils/apiService';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAllUsers();
      setUsers(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const getRoleColor = (role) => {
    return role === 'admin' ? '#e74c3c' : '#27ae60';
  };

  const getRoleBadge = (role) => {
    return role === 'admin' ? '🔐 Admin' : '👤 User';
  };

  return (
    <div className="user-management">
      <div className="container">
        <div className="management-header">
          <h1>User Management</h1>
          <p>Manage all users on the platform</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="management-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Users</option>
              <option value="user">Regular Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <>
            <div className="users-stats">
              <p className="users-count">
                Showing {filteredUsers.length} of {users.length} users
              </p>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="no-data card">
                <p>No users found matching your criteria.</p>
              </div>
            ) : (
              <div className="users-table-wrapper">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user._id} className="user-row">
                        <td className="username-col">
                          <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
                          <span>{user.username}</span>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span
                            className="role-badge"
                            style={{ backgroundColor: getRoleColor(user.role) }}
                          >
                            {getRoleBadge(user.role)}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="btn-action"
                            onClick={() => handleUserClick(user)}
                            title="View Details"
                          >
                            👁️ View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>User Details</h2>
                <button className="modal-close" onClick={closeModal}>✕</button>
              </div>

              <div className="modal-body">
                <div className="user-details-grid">
                  <div className="detail-item">
                    <label>Username</label>
                    <p>{selectedUser.username}</p>
                  </div>

                  <div className="detail-item">
                    <label>Email</label>
                    <p>{selectedUser.email}</p>
                  </div>

                  <div className="detail-item">
                    <label>Role</label>
                    <p>
                      <span
                        className="role-badge"
                        style={{ backgroundColor: getRoleColor(selectedUser.role) }}
                      >
                        {getRoleBadge(selectedUser.role)}
                      </span>
                    </p>
                  </div>

                  <div className="detail-item">
                    <label>User ID</label>
                    <p className="user-id">{selectedUser._id}</p>
                  </div>

                  <div className="detail-item">
                    <label>Account Created</label>
                    <p>{new Date(selectedUser.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="detail-item">
                    <label>Last Updated</label>
                    <p>{new Date(selectedUser.updatedAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="user-info-box">
                  <h3>Account Information</h3>
                  <div className="info-content">
                    <p><strong>Status:</strong> <span className="status-active">Active</span></p>
                    <p><strong>Posts Created:</strong> User can create and manage blog posts</p>
                    <p><strong>Permissions:</strong> Based on {selectedUser.role} role</p>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
