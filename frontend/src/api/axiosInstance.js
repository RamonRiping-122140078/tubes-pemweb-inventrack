import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:6543/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Pasang interceptor untuk menyisipkan token ke header Authorization
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
