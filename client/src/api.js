import axios from 'axios';

// This creates one axios helper that all the pages will use to talk to the backend.
// The address comes from VITE_API_URL so the same code works on my computer and when it is deployed.
// If that setting is missing, it uses the local backend.
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Before every request is sent, this will check if the user has a login token saved.
// If they do, it is then attached so the backend knows who is making the request.
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
