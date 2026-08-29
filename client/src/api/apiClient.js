import axios from 'axios';

// Centralized API Base URL configuration for EduQuery AI frontend
const getBaseURL = () => {
  let url = import.meta.env.VITE_API_BASE_URL || 'https://eduquery-ai-intelligent-college.onrender.com/api';
  return url.replace(/\/+$/, '');
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach auth headers, normalize URLs, and handle FormData boundaries
apiClient.interceptors.request.use((config) => {
  if (config.url) {
    config.url = config.url.replace(/^\/?api\//, '/');
  }

  // If payload is FormData, remove Content-Type to allow browser boundary auto-generation
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  // Retrieve authenticated user token from localStorage if present
  try {
    const storedUser = localStorage.getItem('eduquery_user');
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      if (userObj.token) {
        config.headers.Authorization = `Bearer ${userObj.token}`;
      }
      if (userObj.role) {
        config.headers['x-user-role'] = userObj.role;
      }
      if (userObj.email) {
        config.headers['x-user-email'] = userObj.email;
      }
    }
  } catch (e) {
    // Ignore JSON parse errors
  }

  return config;
});

export default apiClient;
