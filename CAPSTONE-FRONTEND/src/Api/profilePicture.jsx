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
  // If no profile picture or it's already a data URL (Base64), return as is
  if (!profilePictureUrl) {
    // Return default SVG as data URL
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNGM0Y0RjYiLz4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjM3IiByPSIxOCIgZmlsbD0iIzlDQTNBRiIvPgogIDxwYXRoIGQ9Ik0yMCA4MEMyMCA2OS41MDY2IDI4LjUwNjYgNjEgMzkgNjFINjFDNzEuNDkzNCA2MSA4MCA2OS41MDY2IDgwIDgwVjEwMEgyMFY4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
  }
  
  // If it's already a data URL (Base64), return as is
  if (profilePictureUrl.startsWith('data:')) {
    return profilePictureUrl;
  }
  
  // For backward compatibility with old file paths
  const BACKEND_BASE_URL = 'http://localhost:8080';
  if (profilePictureUrl.startsWith('http')) {
    return profilePictureUrl;
  }
  
  return `${BACKEND_BASE_URL}/${profilePictureUrl}`;
};
