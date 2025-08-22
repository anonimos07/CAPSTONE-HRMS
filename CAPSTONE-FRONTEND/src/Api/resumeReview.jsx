import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_REVIEW 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Review resume file (PDF or TXT)
export const reviewResumeFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await API.post('/review-resume-file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};
