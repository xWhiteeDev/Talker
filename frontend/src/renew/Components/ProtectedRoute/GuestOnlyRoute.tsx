import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { LoadingPage } from './page/LoadingPage';

export function GuestOnlyRoute() {
  const { isLogin, isLoading } = useAuth();

  if (isLoading) return <LoadingPage />;
  if (isLogin) return <Navigate to="/" replace />;
  return <Outlet />;
}