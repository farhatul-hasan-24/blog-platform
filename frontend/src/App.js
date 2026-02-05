import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import ManagePosts from './pages/ManagePosts';
import PostDetail from './pages/PostDetail';
import MyPosts from './pages/MyPosts';
import MyPostDetail from './pages/MyPostDetail';
import EditPost from './pages/EditPost';
import PublicPostDetail from './pages/PublicPostDetail';
import Profile from './pages/Profile';
import Blogs from './pages/Blogs';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route 
                path="/posts/:id" 
                element={
                  <ProtectedRoute>
                    <PublicPostDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-posts" 
                element={
                  <ProtectedRoute>
                    <MyPosts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-posts/:id" 
                element={
                  <ProtectedRoute>
                    <MyPostDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-posts/edit/:id" 
                element={
                  <ProtectedRoute>
                    <EditPost />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <AdminRoute>
                    <UserManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/posts" 
                element={
                  <AdminRoute>
                    <ManagePosts />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/posts/:id" 
                element={
                  <AdminRoute>
                    <PostDetail />
                  </AdminRoute>
                } 
              />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <footer className="footer">
            <div className="container">
              <p>&copy; 2026 Blog Platform. Built with React & Express. Role-Based Access Control Demo.</p>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
