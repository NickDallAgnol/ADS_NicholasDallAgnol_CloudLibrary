// src/hooks/useAuth.ts
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
}

export function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token');
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    // Listener para detectar mudanças no localStorage de outras abas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        // Token foi alterado em outra aba
        if (e.newValue) {
          // Novo login em outra aba - recarregar usuário
          loadUser();
        } else {
          // Logout em outra aba - fazer logout aqui também
          setIsAuthenticated(false);
          setUser(null);
          navigate('/login', { replace: true });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  function logout() {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login', { replace: true });
  }

  return { logout, user, isAuthenticated };
}

