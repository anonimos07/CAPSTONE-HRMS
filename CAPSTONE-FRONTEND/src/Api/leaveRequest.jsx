import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_LEAVE_REQUEST
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Submit a new leave request
export const submitLeaveRequest = async (leaveRequestData) => {
  const res = await API.post('/submit', leaveRequestData);
  return res.data;
};

// Get pending leave requests for HR
export const getPendingLeaveRequests = async () => {
  const res = await API.get('/hr');
  return res.data;
};

// Approve a leave request
export const approveLeaveRequest = async (requestId, approvalData) => {
  const res = await API.put(`/approve/${requestId}`, approvalData);
  return res.data;
};

// Reject a leave request
export const rejectLeaveRequest = async (requestId, rejectionData) => {
  const res = await API.put(`/reject/${requestId}`, rejectionData);
  return res.data;
};

// Get leave balance for current user
export const getLeaveBalance = async () => {
  const res = await API.get(`/balance`);
  return res.data;
};

// Get leave requests for current user
export const getEmployeeLeaveRequests = async () => {
  const res = await API.get(`/employee`);
  return res.data;
};

// Get pending requests count
export const getPendingRequestsCount = async () => {
  const res = await API.get('/pending-count');
  return res.data;
};

// Get leave request by ID
export const getLeaveRequestById = async (requestId) => {
  const res = await API.get(`/${requestId}`);
  return res.data;
};
