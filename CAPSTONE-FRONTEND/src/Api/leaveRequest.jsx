import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_LEAVE_REQUEST
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  console.log('=== DEBUG: API Request Interceptor ===');
  console.log('Token from localStorage:', token ? 'Present' : 'Missing');
  console.log('Request URL:', config.url);
  console.log('Base URL:', config.baseURL);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => {
    console.log('=== DEBUG: API Response Success ===');
    console.log('Response data:', response.data);
    return response;
  },
  (error) => {
    console.log('=== DEBUG: API Response Error ===');
    console.log('Error:', error);
    console.log('Error response:', error.response);
    return Promise.reject(error);
  }
);

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
  try {
    console.log('=== DEBUG: Fetching employee leave requests ===');
    console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL_LEAVE_REQUEST);
    console.log('Full URL:', `${import.meta.env.VITE_API_BASE_URL_LEAVE_REQUEST}/employee`);
    
    const res = await API.get(`/employee`);
    console.log('Leave requests response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    throw error;
  }
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
