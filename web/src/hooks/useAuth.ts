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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      api.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem('token');
        });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  function logout() {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login', { replace: true });
  }

  return { logout, user, isAuthenticated };
}

