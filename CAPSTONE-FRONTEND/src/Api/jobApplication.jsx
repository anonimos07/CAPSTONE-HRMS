import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_JOB_APPLICATION,   
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const submitJobApplication = async (applicationData) => {
  const formData = new FormData();
  formData.append('position', applicationData.position);
  formData.append('email', applicationData.email);
  formData.append('contact', applicationData.contact);
  formData.append('fullName', applicationData.fullName);
  formData.append('file', applicationData.file);

  const response = await API.post('/submit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};


