import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_POSITION 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Create new position
export const createPosition = async (positionData) => {
  const res = await API.post('/add', positionData);
  return res.data;
};

// Get all positions
export const getAllPositions = async () => {
  const res = await API.get('/');
  return res.data;
};
