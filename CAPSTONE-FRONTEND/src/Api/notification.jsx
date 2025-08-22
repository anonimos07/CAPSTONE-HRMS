import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_NOTIFICATION
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Get user notifications
export const getUserNotifications = async () => {
  const res = await API.get('/user');
  return res.data;
};

// Get unread notifications for user
export const getUnreadNotifications = async () => {
  const res = await API.get('/user/unread');
  return res.data;
};

// Get unread notification count
export const getUnreadNotificationCount = async () => {
  const res = await API.get('/user/unread/count');
  return res.data;
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  const res = await API.put(`/${notificationId}/read`);
  return res.data;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  const res = await API.put('/user/read-all');
  return res.data;
};

// Delete notification
export const deleteNotification = async (notificationId) => {
  const res = await API.delete(`/${notificationId}`);
  return res.data;
};

// Get all notifications (admin function)
export const getAllNotifications = async () => {
  const res = await API.get('/all');
  return res.data;
};

// Send notification to all users (HR function)
export const sendNotificationToAll = async (notificationData) => {
  const res = await API.post('/send-all', notificationData);
  return res.data;
};

// Send notification to specific user (HR function)
export const sendNotificationToUser = async (userId, notificationData) => {
  const res = await API.post(`/send/${userId}`, notificationData);
  return res.data;
};
