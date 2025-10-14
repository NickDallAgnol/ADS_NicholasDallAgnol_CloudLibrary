// src/components/RequireAuth.tsx
import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

export function RequireAuth({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}
