import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_EMPLOYEE,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const fetchCurrentUserDetails = async () => {
  try {
    const res = await API.get('/details');
    return res.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { message: 'Employee details not yet created' };
    }
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  const res = await API.put('/update-profile', profileData);
  return res.data;
};