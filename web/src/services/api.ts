// web/src/services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Cria um interceptor de requisições
api.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage
    const token = localStorage.getItem('authToken');

    // Se o token existir, adiciona ele ao cabeçalho de Autorização
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Retorna a configuração modificada para a requisição continuar
    return config;
  },
  (error) => {
    // Em caso de erro, rejeita a promise
    return Promise.reject(error);
  },
);