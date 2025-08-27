import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_PROFILE_PHOTO

// Create axios instance with interceptors for token handling
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Upload a profile picture
 * @param {File} file - The image file to upload
 * @returns {Promise} API response
 */
export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Get current user's profile picture URL
 * @returns {Promise} API response
 */
export const getProfilePicture = async () => {
  const response = await api.get('/picture');
  return response.data;
};

/**
 * Reset profile picture to default
 * @returns {Promise} API response
 */
export const resetProfilePicture = async () => {
  const response = await api.delete('/picture');
  return response.data;
};

/**
 * Get full URL for profile picture
 * @param {string} profilePictureUrl - The relative URL from the API
 * @returns {string} Full URL for the image
 */
export const getProfilePictureFullUrl = (profilePictureUrl) => {
  const BACKEND_BASE_URL = 'http://localhost:8080';
  
  if (!profilePictureUrl) {
    return `${BACKEND_BASE_URL}/default-profile.png`;
  }
  
  if (profilePictureUrl.startsWith('http')) {
    return profilePictureUrl;
  }
  
  return `${BACKEND_BASE_URL}/${profilePictureUrl}`;
};
