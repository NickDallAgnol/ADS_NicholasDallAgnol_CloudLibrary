import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';

export function RequireAuth({ children }: { children: ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsChecking(false);
        return;
      }

      try {
        // Validar token com o backend
        await api.get('/auth/me');
        setIsAuthenticated(true);
      } catch (error) {
        // Token inválido ou expirado
        console.error('Token inválido:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    }

    checkAuth();
  }, [location.pathname]);

  if (isChecking) {
    // Mostrar loading enquanto verifica autenticação
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-blue-700">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-700 font-medium">Verificando autenticação...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

export default RequireAuth;

