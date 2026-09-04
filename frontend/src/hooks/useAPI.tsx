import { useNavigate } from 'react-router-dom';
import { emitServer } from '../lib/API/emitServer';
import { ErrorHandler } from '../lib/customError';
import type { EmitMethod, EmitData, EmitResult } from '../types/API';
import { useCallback, useContext, useRef } from 'react';
import { refreshToken } from '../lib/API/refreshToken';
import {AuthContext} from '../context/authContext';

export function useAPI() {
  const nav = useNavigate();
  const retry = useRef<boolean>(false);
  const authContext = useContext(AuthContext)
  const request = useCallback(
    async function request<T>(url: string, method: EmitMethod, data?: EmitData):Promise<EmitResult<T> | undefined> {
      try {
        const result = await emitServer<T>(url, method, data);
        return result;
      } catch (error) {
        if (error instanceof ErrorHandler) {
          if (error.code == 401) {
            if (retry.current === true) {
              nav('/auth/login');
              authContext?.logout()
              return;
            }
            retry.current = true;
            const refreshedNewToken = await refreshToken();
            if (!refreshedNewToken.success && refreshedNewToken.requiresLogin) {
              nav('/auth/login');
              authContext?.logout()
              return;
            }
            if (!refreshedNewToken.success && !refreshedNewToken.requiresLogin) {
              throw new ErrorHandler('API Server fault', 500);
            }
            if (refreshedNewToken.success) {
              const res = await request<T>(url, method, data);
              retry.current = false
              return res
            }
          }
          throw error;
        }
      }
    },
    [nav],
  );

  return { request };
}
