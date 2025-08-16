import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Clock In/Out operations
export const clockIn = async (photoBase64) => {
  const res = await API.post('/timelog/time-in', { photo: photoBase64 });
  return res.data;
};

export const clockOut = async (photoBase64) => {
  const res = await API.post('/timelog/time-out', { photo: photoBase64 });
  return res.data;
};

// Break operations
export const startBreak = async () => {
  const res = await API.post('/timelog/break/start');
  return res.data;
};

export const endBreak = async () => {
  const res = await API.post('/timelog/break/end');
  return res.data;
};

// Status and timelog retrieval
export const getCurrentStatus = async () => {
  const res = await API.get('/timelog/status');
  return res.data;
};

export const getTodayTimelog = async () => {
  const res = await API.get('/timelog/today');
  return res.data;
};

export const getTimelogsByDateRange = async (startDate, endDate) => {
  const res = await API.get('/timelog/range', {
    params: { startDate, endDate }
  });
  return res.data;
};

export const getAllUserTimelogs = async () => {
  const res = await API.get('/timelog/user/all');
  return res.data;
};

export const getTotalWorkedHours = async (startDate, endDate) => {
  const res = await API.get('/timelog/hours/total', {
    params: { startDate, endDate }
  });
  return res.data;
};

export const getMonthlyTimelogs = async (year, month) => {
  const res = await API.get('/timelog/monthly', {
    params: { year, month }
  });
  return res.data;
};

// HR/Admin operations
export const adjustTimelog = async (adjustmentData) => {
  const res = await API.post('/timelog/adjust', adjustmentData);
  return res.data;
};

export const getAllTimelogs = async () => {
  const res = await API.get('/timelog/all');
  return res.data;
};

export const getUsersClockedIn = async () => {
  const res = await API.get('/timelog/users/clocked-in');
  return res.data;
};

export const getUsersOnBreak = async () => {
  const res = await API.get('/timelog/users/on-break');
  return res.data;
};

export const getIncompleteTimelogs = async () => {
  const res = await API.get('/timelog/incomplete');
  return res.data;
};

export const deleteTimelog = async (timelogId) => {
  const res = await API.delete(`/timelog/${timelogId}`);
  return res.data;
};
