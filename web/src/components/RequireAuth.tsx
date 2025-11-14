import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export function RequireAuth({ children }: { children: ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar se há token válido no localStorage
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setIsChecking(false);
  }, []);

  if (isChecking) {
    // Mostrar loading enquanto verifica autenticação
    return <div className="flex items-center justify-center h-screen">Verificando autenticação...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default RequireAuth;

