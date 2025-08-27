import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Get authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create axios instance with auth headers
const createAuthHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${getAuthToken()}`,
    'Content-Type': 'application/json'
  }
});

// Get all users with optional search
export const getAllUsers = async (searchTerm = '') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hr/users`, {
      ...createAuthHeaders(),
      params: {
        search: searchTerm
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get specific user details
export const getUserDetails = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hr/users/${userId}`, createAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};
