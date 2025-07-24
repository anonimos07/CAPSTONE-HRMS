import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_NOTIFICATION,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchNotifications = async (userId) => {
  const res = await API.get(`/${userId}`);
  return res.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const res = await API.put(`/mark-as-read/${notificationId}`);
  return res.data;
};
