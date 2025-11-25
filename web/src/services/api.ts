// src/services/api.ts
import axios from 'axios';

// Usar variável de ambiente ou fallback para localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para lidar com erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se receber 401 (Unauthorized), remover token e redirecionar para login
    if (error.response?.status === 401) {
      const token = localStorage.getItem('token');
      if (token) {
        localStorage.removeItem('token');
        // Redirecionar para login apenas se não estiver já na página de login/register
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;