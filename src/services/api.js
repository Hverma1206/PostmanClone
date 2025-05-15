import axios from 'axios';

// Create an axios instance with the base URL from environment variables
const api = axios.create({
  baseURL: process.env.BACKEND_ENDPOINT || 'http://localhost:5000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for handling errors or adding auth tokens
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common response patterns
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
