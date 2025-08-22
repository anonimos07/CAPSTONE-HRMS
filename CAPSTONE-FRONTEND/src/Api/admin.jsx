import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_ADMIN 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Admin Authentication
export const adminLogin = async (loginData) => {
  const res = await API.post('/login', loginData);
  return res.data;
};

// Create HR
export const createHR = async (hrData) => {
  const res = await API.post('/create-hr', hrData);
  return res.data;
};

// Create Employee
export const createEmployee = async (employeeData) => {
  const res = await API.post('/create-employee', employeeData);
  return res.data;
};

// Test endpoint
export const testAdmin = async () => {
  const res = await API.get('/');
  return res.data;
};
