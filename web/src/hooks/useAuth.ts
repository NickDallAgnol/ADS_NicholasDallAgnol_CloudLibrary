// src/hooks/useAuth.ts
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem('authToken');
    navigate('/', { replace: true });
  }
  return { logout };
}
