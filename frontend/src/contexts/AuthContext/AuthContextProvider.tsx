import { useEffect, useState } from 'react';
import emitServer from '../../lib/API/emitServer';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import type { IAuthLoginResponse, IAuthorizedUser, IAuthorizationResult } from './types';

export function AuthContextProvider({ children }: React.PropsWithChildren) {
  const [isLogin, setLoginState] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<IAuthorizedUser | undefined>(undefined);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const sessionResult = await emitServer<IAuthLoginResponse>('/api/auth/isAuth', 'GET');
        if (sessionResult.success && sessionResult.data) {
          setLoginState(true);
          setUser({
            firstName: sessionResult.data.firstName,
            lastName: sessionResult.data.lastName,
            welcomeSeen: sessionResult.data.welcomeSeen,
          });
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function setLogged(email: string, password: string): Promise<IAuthorizationResult> {
    const result = await emitServer<IAuthLoginResponse>('/api/auth/signin', 'POST', { email, password });

    if (!result.success || !result.data) {
      return { status: 'error' };
    }

    const { verified, firstName, lastName, welcomeSeen } = result.data;

    if (verified === 'unverified') return { status: 'unverified' };
    if (verified === 'suspended') return { status: 'suspended' };

    setLoginState(true);
    setUser({ firstName, lastName, welcomeSeen });
    return { status: 'ok', welcomeSeen };
  }
  async function logout(): Promise<boolean> {
    try {
      const result = await emitServer<IAuthLoginResponse>('/api/auth/logout', 'POST', undefined);
      if (result.success == true) {
        setLoginState(false);
        setUser(undefined);
        nav('/signin');
        console.log('[LOG] Logged out');
      }
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user: user, setLogged: setLogged, logout: logout, isLogin: isLogin, isLoading: isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
