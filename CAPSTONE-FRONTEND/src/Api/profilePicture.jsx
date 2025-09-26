import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_PROFILE_PHOTO


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
 * Get profile picture for a specific user
 * @param {string} userId - The user ID to get profile picture
 * @returns {Promise} API response
 */
export const getProfilePictureByUserId = async (userId) => {
  const response = await api.get(`/picture/${userId}`);
  return response.data;
};

/**
 * Get all users' profile pictures 
 * @returns {Promise} API response with map of userId 
 */
export const getAllUsersProfilePictures = async () => {
  const response = await api.get('/pictures/all');
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
 * @param {string} profilePictureUrl 
 * @returns {string} Full URL for the image
 */
export const getProfilePictureFullUrl = (profilePictureUrl) => {
  if (!profilePictureUrl) {
    // Return default SVG as data URL
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNGM0Y0RjYiLz4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjM3IiByPSIxOCIgZmlsbD0iIzlDQTNBRiIvPgogIDxwYXRoIGQ9Ik0yMCA4MEMyMCA2OS41MDY2IDI4LjUwNjYgNjEgMzkgNjFINjFDNzEuNDkzNCA2MSA4MCA2OS41MDY2IDgwIDgwVjEwMEgyMFY4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
  }
  
  
  if (profilePictureUrl.startsWith('data:')) {
    return profilePictureUrl;
  }
  
  
  const BACKEND_BASE_URL = 'http://localhost:8080';
  if (profilePictureUrl.startsWith('http')) {
    return profilePictureUrl;
  }
  
  return `${BACKEND_BASE_URL}/${profilePictureUrl}`;
};
