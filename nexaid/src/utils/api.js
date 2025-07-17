// FILE: src/utils/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getMe: () => api.get('/api/auth/me'),
  updateProfile: (data) => api.put('/api/auth/updatedetails', data),
  logout: () => api.get('/api/auth/logout'),
};

// Internships API calls
export const internshipsAPI = {
  getAll: (params = {}) => api.get('/api/internships', { params }),
  getById: (id) => api.get(`/api/internships/${id}`),
  getFeatured: () => api.get('/api/internships/featured'),
  getRecent: () => api.get('/api/internships/recent'),
  getMy: () => api.get('/api/internships/my'),
  create: (data) => api.post('/api/internships', data),
  update: (id, data) => api.put(`/api/internships/${id}`, data),
  delete: (id) => api.delete(`/api/internships/${id}`),
};

// Applications API calls
export const applicationsAPI = {
  apply: (formData) => api.post('/api/applications', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMy: () => api.get('/api/applications/my'),
  getForInternship: (internshipId) => api.get(`/api/applications/internship/${internshipId}`),
  updateStatus: (id, data) => api.put(`/api/applications/${id}/status`, data),
  getStats: () => api.get('/api/applications/stats'),
};

export default api;