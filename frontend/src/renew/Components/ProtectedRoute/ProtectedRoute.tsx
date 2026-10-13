import type React from 'react';
import { useEffect, useState } from 'react';
import emitServer from '../../../lib/API/emitServer';
import { useNavigate } from 'react-router-dom';
import { LoadingPage } from './page/LoadingPage';

interface IAuthorizationPayload {
  id: number;
}

export function ProtectedRoute({ children }: React.PropsWithChildren) {
  const [loading, setLoading] = useState<boolean>(true);
  const [logged, setLogged] = useState<boolean>(false);
  const nav = useNavigate();
  useEffect(() => {
    async () => {
      const result = await emitServer<IAuthorizationPayload>('/api/auth/isAuth', 'GET');
      if (!result.success) {
        setLogged(false);
        nav('/signin');
        //TODO: NOTIFICATION "UNAUTHORISED"
      } else {
        setLogged(true);
      }
      setLoading(false);
    };
  });
  return !loading && logged ? children : <LoadingPage />;
}
