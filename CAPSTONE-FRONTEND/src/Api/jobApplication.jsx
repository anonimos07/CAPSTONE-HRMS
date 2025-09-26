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


export const getAllApplications = async () => {
  const res = await API.get('/application');
  return res.data;
};


export const getApplicationById = async (id) => {
  const res = await API.get(`/${id}`);
  return res.data;
};


export const updateApplicationStatus = async (id, statusData) => {
  const res = await API.put(`/${id}/status`, statusData);
  return res.data;
};


export const downloadResume = async (id, filename) => {
  const res = await API.get(`/${id}/download`, {
    responseType: 'blob',
  });
  

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename || 'resume.pdf');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
