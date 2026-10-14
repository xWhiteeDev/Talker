import { useState } from 'react';
import emitServer from '../../lib/API/emitServer';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import type { TLoginReturnUserState, IAuthLoginResponse, IAuthorizedUser } from './types';

export function AuthContextProvider({ children }: React.PropsWithChildren) {
  const [isLogin, setLoginState] = useState<boolean>(false);
  const [user, setUser] = useState<IAuthorizedUser | undefined>(undefined);
  const nav = useNavigate();
  async function setLogged(email: string, password: string): Promise<TLoginReturnUserState> {
    try {
      const result = await emitServer<IAuthLoginResponse>('/api/auth/signin', 'POST', { email, password });
      if (!result.success) {
        console.error('Failed to log in.');
        return 'error';
      }
      if (!result.data) {
        console.error('Failed to get data from result.');
        return 'error';
      }
      if (result.data && result.data.verified === 'unverified') {
        return 'unverified';
      }
      setLoginState(true);
      setUser({ firstName: result.data.firstName, lastName: result.data.lastName });
      return 'ok';
    } catch (error) {
      throw error
    }
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
    }
  }

  return (
    <AuthContext.Provider value={{ user: user, setLogged: setLogged, logout: logout, isLogin: isLogin }}>
      {children}
    </AuthContext.Provider>
  );
}
