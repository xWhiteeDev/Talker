import { Outlet } from 'react-router-dom';
import { AuthContextProvider } from './AuthContextProvider';

export function AuthLayout() {
  return (
    <AuthContextProvider>
      <Outlet />
    </AuthContextProvider>
  );
}
