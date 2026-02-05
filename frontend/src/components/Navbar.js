import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    navigate('/profile');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            📝 Blog Platform
          </Link>
          
          <div className="navbar-menu">
            <Link to="/" className="navbar-link">Home</Link>
            <Link to="/blogs" className="navbar-link">Blogs</Link>
            
            {isAuthenticated() ? (
              <>
                {!isAdmin() && null}
                {isAdmin() && (
                  <Link to="/admin" className="navbar-link">Admin Dashboard</Link>
                )}
                <div className="navbar-user" ref={dropdownRef}>
                  <div className="user-icon-container" onClick={() => setShowDropdown(!showDropdown)}>
                    <div className="user-avatar">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    {isAdmin() && <span className="badge-admin-icon">A</span>}
                  </div>
                  
                  {showDropdown && (
                    <div className="user-dropdown">
                      <div className="dropdown-header">
                        <div className="dropdown-user-info">
                          <span className="dropdown-username">{user?.username}</span>
                          <span className="dropdown-email">{user?.email}</span>
                        </div>
                      </div>
                      <div className="dropdown-divider"></div>
                      {!isAdmin() && (
                        <>
                          <Link to="/dashboard" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                            <span className="dropdown-icon">📊</span>
                            Dashboard
                          </Link>
                          <Link to="/my-posts" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                            <span className="dropdown-icon">🗂️</span>
                            My Posts
                          </Link>
                          <div className="dropdown-divider"></div>
                        </>
                      )}
                      <button onClick={handleProfileClick} className="dropdown-item">
                        <span className="dropdown-icon">👤</span>
                        Profile
                      </button>
                      <button onClick={handleLogout} className="dropdown-item logout">
                        <span className="dropdown-icon">🚪</span>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-link">Login</Link>
                <Link to="/register" className="btn btn-primary btn-small">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
