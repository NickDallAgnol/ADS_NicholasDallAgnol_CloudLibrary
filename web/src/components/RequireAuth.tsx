import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';

/**
 * Componente de proteção de rotas
 * Valida autenticação antes de renderizar conteúdo privado
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const token = localStorage.getItem('token');
      
      if (!token) {
        if (isMounted) {
          setIsAuthenticated(false);
          setIsChecking(false);
        }
        return;
      }

      try {
        // Valida o token consultando a API
        const response = await api.get('/auth/me');
        if (isMounted && response.data) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Token inválido ou expirado - remove e redireciona
        localStorage.removeItem('token');
        if (isMounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isChecking) {
    // Mostrar loading enquanto verifica autenticação
    return (
      <div className="flex items-center justify-center h-screen gradient-blue">
        <div className="card p-10 animate-slide-in">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-700 font-semibold text-lg">Verificando autenticação...</p>
            <p className="text-gray-500 text-sm">Aguarde um momento</p>
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


