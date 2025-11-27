// src/services/api.ts
import axios from 'axios';

/**
 * Configuração do cliente HTTP
 * Gerencia autenticação e interceptação de requisições
 */

// Usa a URL da API do ambiente ou localhost como fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
});

/**
 * Interceptor de requisições
 * Adiciona automaticamente o token JWT no header Authorization
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Interceptor de respostas
 * Trata automaticamente erros de autenticação (401)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token inválido ou expirado - desloga o usuário
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