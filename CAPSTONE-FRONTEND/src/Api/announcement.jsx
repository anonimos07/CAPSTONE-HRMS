import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_ANNOUNCEMENT
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Create announcement (HR/Admin only)
export const createAnnouncement = async (announcementData) => {
  const res = await API.post('/create', announcementData);
  return res.data;
};

// Get all active announcements
export const getActiveAnnouncements = async () => {
  const res = await API.get('/active');
  return res.data;
};

// Get all announcements
export const getAllAnnouncements = async () => {
  const res = await API.get('/all');
  return res.data;
};

// Get announcements by current user
export const getUserAnnouncements = async () => {
  const res = await API.get('/user');
  return res.data;
};

// Get announcements by priority
export const getAnnouncementsByPriority = async (priority) => {
  const res = await API.get(`/priority/${priority}`);
  return res.data;
};

// Get announcement by ID
export const getAnnouncementById = async (id) => {
  const res = await API.get(`/${id}`);
  return res.data;
};

// Update announcement (HR/Admin only)
export const updateAnnouncement = async (id, announcementData) => {
  const res = await API.put(`/${id}`, announcementData);
  return res.data;
};

// Deactivate announcement (HR/Admin only)
export const deactivateAnnouncement = async (id) => {
  const res = await API.put(`/${id}/deactivate`);
  return res.data;
};

// Delete announcement (HR/Admin only)
export const deleteAnnouncement = async (id) => {
  const res = await API.delete(`/${id}`);
  return res.data;
};
