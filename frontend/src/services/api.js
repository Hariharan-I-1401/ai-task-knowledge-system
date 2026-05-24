import axios from 'axios';

const api = axios.create({
  // Base URL matching your FastAPI router mount prefix
  baseURL: 'http://127.0.0.1:8000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// GLOBAL INTERCEPTOR: Dynamically fetches the fresh token before every request fires
api.interceptors.request.use(
  (config) => {
    // FIXED: Changed key name from 'access_token' to 'token' to perfectly align with AuthContext
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("API Interceptor Warning: No token found in localStorage.");
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;