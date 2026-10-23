import type React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { LoadingPage } from './page/LoadingPage';
import { useAuth } from '../../../hooks/useAuth';

export function ProtectedRoute({ children }: React.PropsWithChildren) {
  const { isLogin, isLoading } = useAuth();
  if (isLoading) return <LoadingPage />;
  if (!isLogin) return <Navigate to={'/signin'} replace />;
  return <Outlet/>;
}
