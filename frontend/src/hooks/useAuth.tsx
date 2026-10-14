import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext/AuthContext';

export function useAuth() {
  const authCtx = useContext(AuthContext);
  if (!authCtx) {
    throw new Error('Auth Context tried to be used out of range!');
  }
  return authCtx;
}
