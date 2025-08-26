import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_TIME_EDIT
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Create a new timelog edit request
export const createTimelogEditRequest = async (requestData) => {
  const res = await API.post('/create', requestData);
  return res.data;
};

// Get all HR staff for dropdown
export const getAllHrStaff = async () => {
  const res = await API.get('/hr-staff');
  return res.data;
};

// Get requests by employee
export const getRequestsByEmployee = async () => {
  const res = await API.get('/employee');
  return res.data;
};

// Get requests assigned to HR
export const getRequestsByHr = async () => {
  const res = await API.get('/hr');
  return res.data;
};

// Get pending requests by HR
export const getPendingRequestsByHr = async () => {
  const res = await API.get('/hr/pending');
  return res.data;
};

// Approve request
export const approveTimelogEditRequest = async (requestId, hrResponse) => {
  const res = await API.put(`/approve/${requestId}`, { hrResponse });
  return res.data;
};

// Reject request
export const rejectTimelogEditRequest = async (requestId, hrResponse) => {
  const res = await API.put(`/reject/${requestId}`, { hrResponse });
  return res.data;
};

// Get request by ID
export const getTimelogEditRequestById = async (requestId) => {
  const res = await API.get(`/${requestId}`);
  return res.data;
};
