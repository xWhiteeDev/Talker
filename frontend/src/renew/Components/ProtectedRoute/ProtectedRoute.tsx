import type React from 'react';
import { useEffect, useState } from 'react';
import emitServer from '../../../lib/API/emitServer';
import { useNavigate } from 'react-router-dom';
import { LoadingPage } from './page/LoadingPage';
import { EmitError } from '../../../lib/Error/EmitError';

interface IAuthorizationPayload {
  id: number;
}

export function ProtectedRoute({ children }: React.PropsWithChildren) {
  const [loading, setLoading] = useState<boolean>(true);
  const [logged, setLogged] = useState<boolean>(false);
  const nav = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const result = await emitServer<IAuthorizationPayload>('/api/auth/isAuth', 'GET');
        if (!result.success) {
          setLogged(false);
          nav('/signin');
        } else {
          setLogged(true);
        }
        setLoading(false);
      } catch (error) {
        if (error instanceof EmitError) {
          if (error.statusCode === 401) {
            nav('/signin');
            //TODO: NOTIFICATION "UNAUTHORISED"
          }
          console.log(error.statusCode, error.message);
        }
      }
    })();
    75;
  });
  return !loading && logged ? children : <LoadingPage />;
}
