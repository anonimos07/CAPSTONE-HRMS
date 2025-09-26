import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_JOB_POSITION;

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


export const createJobPosition = async (jobPositionData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add`, jobPositionData, createAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error creating job position:', error);
    throw error;
  }
};

export const getAllJobPositions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`, createAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching job positions:', error);
    throw error;
  }
};

export const getJobPositionById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, createAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching job position by ID:', error);
    throw error;
  }
};

export const updateJobPosition = async (id, jobPositionData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, jobPositionData, createAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error updating job position:', error);
    throw error;
  }
};

export const deleteJobPosition = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, createAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error deleting job position:', error);
    throw error;
  }
};
