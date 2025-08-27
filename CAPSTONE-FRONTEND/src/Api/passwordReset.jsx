import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_PASSWORD 

// Create axios instance with interceptors for token handling
const api = axios.create({
  baseURL: API_BASE_URL,
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Initiate password reset process
 * @param {string} identifier - Email or username
 * @returns {Promise} API response
 */
export const forgotPassword = async (identifier) => {
  const response = await api.post('/forgot-password', {
    identifier
  });
  return response.data;
};

/**
 * Reset password using token
 * @param {string} token - Reset token from email
 * @param {string} newPassword - New password
 * @param {string} confirmPassword - Password confirmation
 * @returns {Promise} API response
 */
export const resetPassword = async (token, newPassword, confirmPassword) => {
  const response = await api.post('/reset-password', {
    token,
    newPassword,
    confirmPassword
  });
  return response.data;
};

/**
 * Change password for authenticated user
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @param {string} confirmPassword - Password confirmation
 * @returns {Promise} API response
 */
export const changePassword = async (currentPassword, newPassword, confirmPassword) => {
  const response = await api.post('/change-password', {
    currentPassword,
    newPassword,
    confirmPassword
  });
  return response.data;
};

/**
 * Validate reset token
 * @param {string} token - Reset token to validate
 * @returns {Promise} API response
 */
export const validateResetToken = async (token) => {
  const response = await api.get(`/validate-reset-token?token=${encodeURIComponent(token)}`);
  return response.data;
};
