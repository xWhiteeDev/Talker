import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { refreshToken } from '../../../lib/API/refreshToken';

interface AuthorizationProtectedRouteProps {
  children: React.ReactNode;
}

export default function AuthorizationProtectedRoute({ children }: AuthorizationProtectedRouteProps) {
  const nav = useNavigate();
  const authContext = useContext(AuthContext);
  useEffect(() => {
    (async () => {
      const authorizationResult = await refreshToken();
      if (authorizationResult.success && !authorizationResult.requiresLogin) {
        nav('/');
        return;
      }
    })();
  }, [nav]);
  return authContext?.loggedIn ? <span>Redirecting...</span> : children;
}
