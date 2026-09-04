import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { refreshToken } from '../../../lib/API/refreshToken';
import { Loading } from '../../generic/UI/Loading/Loading';
import { AuthContext } from '../../../context/authContext';
import { useAPI } from '../../../hooks/useAPI';
import type {IUser} from '../../../types/User';

type AuthorizationStatus = 'Unauthorized' | 'Authorized' | 'Checking';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const nav = useNavigate();
  const [status, setStatus] = useState<AuthorizationStatus>('Checking');
  const authContext = useContext(AuthContext);
  const { request } = useAPI();
  useEffect(() => {
    (async () => {
      const result = await refreshToken();
      setStatus(result.requiresLogin ? 'Unauthorized' : 'Authorized');
    })();
  }, []);

  useEffect(() => {
    if (status == 'Unauthorized') {
      nav('/auth/login');
      authContext?.logout();
    }
    if (status == 'Authorized') {
      (async () => {
        const result = await request<IUser>('/api/auth/isAuth', 'GET');
        if (!result || (result && !result.success)) {
          authContext?.logout();
          return;
        }
        authContext?.login(result.data)
      })();
    }
  }, [status]);

  if (status === 'Checking') {
    return <Loading />;
  }
  if (status === 'Unauthorized') return null;
  return children;
}
