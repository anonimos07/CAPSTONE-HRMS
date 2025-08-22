import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_JOB_APPLICATION 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Submit job application with file upload
export const submitJobApplication = async (applicationData) => {
  const formData = new FormData();
  formData.append('position', applicationData.position);
  formData.append('email', applicationData.email);
  formData.append('contact', applicationData.contact);
  formData.append('fullName', applicationData.fullName);
  formData.append('file', applicationData.file);

  const res = await API.post('/submit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// Get all applications (HR only)
export const getAllApplications = async () => {
  const res = await API.get('/application');
  return res.data;
};

// Get application by ID (HR/Admin only)
export const getApplicationById = async (id) => {
  const res = await API.get(`/${id}`);
  return res.data;
};

// Update application status (HR/Admin only)
export const updateApplicationStatus = async (id, statusData) => {
  const res = await API.put(`/${id}/status`, statusData);
  return res.data;
};
