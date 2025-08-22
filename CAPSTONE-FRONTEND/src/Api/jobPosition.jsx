import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_JOB_POSITION || 'http://localhost:8080/api/job-positions';

// Create axios instance with base configuration
const jobPositionApi = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include JWT token
jobPositionApi.interceptors.request.use(
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

// Job Position API functions
export const createJobPosition = async (jobPositionData) => {
  const response = await jobPositionApi.post('/add', jobPositionData);
  return response.data;
};

export const getAllJobPositions = async () => {
  const response = await jobPositionApi.get('');
  return response.data;
};

export const getJobPositionById = async (id) => {
  const response = await jobPositionApi.get(`/${id}`);
  return response.data;
};

export const updateJobPosition = async (id, jobPositionData) => {
  const response = await jobPositionApi.put(`/${id}`, jobPositionData);
  return response.data;
};

export const deleteJobPosition = async (id) => {
  const response = await jobPositionApi.delete(`/${id}`);
  return response.data;
};
