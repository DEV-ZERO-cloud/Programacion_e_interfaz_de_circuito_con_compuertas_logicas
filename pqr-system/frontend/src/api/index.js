import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pqr_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('pqr_token');
      localStorage.removeItem('pqr_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const login = (email, password) => {
  const form = new URLSearchParams();
  form.append('username', email);
  form.append('password', password);
  return api.post('/api/auth/token', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
};

export const register = (data) => api.post('/api/auth/register', data);
export const getMe = () => api.get('/api/auth/me');

// PQRs
export const getPQRs = (params) => api.get('/api/pqrs', { params });
export const getPQR = (id) => api.get(`/api/pqrs/${id}`);
export const createPQR = (data) => api.post('/api/pqrs', data);
export const updatePQR = (id, data) => api.patch(`/api/pqrs/${id}`, data);
export const deletePQR = (id) => api.delete(`/api/pqrs/${id}`);
export const getStats = () => api.get('/api/pqrs/stats');

// Comments
export const addComment = (pqrId, content) =>
  api.post(`/api/pqrs/${pqrId}/comments`, { content });

// Users
export const getUsers = () => api.get('/api/users');
export const getSupervisors = () => api.get('/api/users/supervisors');

export default api;
