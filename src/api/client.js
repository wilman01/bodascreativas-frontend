import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
export const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:4000';
export const TOKEN_KEY = 'bc_token';

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login');
      }
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'Ocurrio un error inesperado. Intenta nuevamente.';
    return Promise.reject(new Error(message));
  }
);

export function resolveFileUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${UPLOADS_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export function formatDate(value) {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatBytes(bytes = 0) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(1)} ${units[i]}`;
}

export default api;
