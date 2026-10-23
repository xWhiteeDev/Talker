import { useCallback, useState } from 'react';
import type { IEmitResponse, TAPIMethod } from '../types/lib/types';
import emitServer from '../lib/API/emitServer';
import { EmitError } from '../lib/Error/EmitError';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export function useAPI() {
  const [isLoading, setLoading] = useState<boolean>(true);
  const { setLoginState, setUser } = useAuth();
  const navigate = useNavigate();
  const request = useCallback(
    async function request<T>(route: string, method: TAPIMethod, data?: unknown, hasTriedToRefresh = false): Promise<IEmitResponse<T>> {
      try {
        const emitResult = await emitServer<T>(route, method, data);
        return emitResult;
      } catch (error) {
        if (error instanceof EmitError) {
          switch (error.statusCode) {
            case 400:
              //Show notification
              break;
            case 401:
              if (hasTriedToRefresh == true) {
                //Show notification
                setLoginState(false);
                setUser(undefined);
                navigate('/signin', { replace: true });
                console.log('Failed to refresh')
                throw error;
              }
              const refreshResult = await request<T>('/api/auth/refresh', 'POST', undefined, true);
              if (!refreshResult) throw error;
              return await request<T>(route, method, data, true);
          }
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoginState, navigate],
  );
  return { request, isLoading };
}
