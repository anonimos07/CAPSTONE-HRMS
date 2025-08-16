import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const TestAuth = () => {
  const testAPI = axios.create({
    baseURL: 'http://localhost:8080/api',
  });

  testAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const { data, error, isLoading } = useQuery({
    queryKey: ['test-auth'],
    queryFn: async () => {
      const response = await testAPI.get('/timelog/status');
      return response.data;
    },
    retry: false,
  });

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-bold mb-2">Authentication Test</h3>
      {isLoading && <p>Testing...</p>}
      {error && (
        <div className="text-red-600">
          <p>Error: {error.message}</p>
          <p>Status: {error.response?.status}</p>
          <p>Data: {JSON.stringify(error.response?.data)}</p>
        </div>
      )}
      {data && (
        <div className="text-green-600">
          <p>Success!</p>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestAuth;
