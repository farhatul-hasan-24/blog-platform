import api from './api';

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Posts API calls
export const postsAPI = {
  getAllPosts: () => api.get('/posts'),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (postData) => api.post('/posts', postData),
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/posts/${id}`),
  getUserPosts: (userId) => api.get(`/posts/user/${userId}`),
  toggleLike: (id) => api.post(`/posts/${id}/like`),
  ratePost: (id, value) => api.post(`/posts/${id}/rate`, { value }),
};

// Comments API calls
export const commentsAPI = {
  addComment: (postId, text) => api.post(`/comments/${postId}/comments`, { text }),
  toggleCommentLike: (postId, commentId) =>
    api.post(`/comments/${postId}/comments/${commentId}/like`),
  deleteComment: (postId, commentId) =>
    api.delete(`/comments/${postId}/comments/${commentId}`),
};

// Users API calls
export const usersAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  getUserStats: () => api.get('/users/stats/overview'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
};
