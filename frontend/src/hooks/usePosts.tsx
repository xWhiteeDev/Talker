import { useCallback, useEffect, useState } from 'react';
import { useAPI } from './useAPI';
import { ErrorHandler } from '../lib/customError';
import type { IPostShape } from '../types/hooks/IPostHook';
import useNotify from './useNotify';

export function usePosts() {
  const [posts, setPosts] = useState<IPostShape[] | undefined>(undefined);
  const [isLoading, setLoading] = useState<boolean>(true);
  const { request } = useAPI();
  const { setNotification } = useNotify();
  const refresh = useCallback(
    async function refresh() {
      setLoading(true);
      try {
        const result = await request<IPostShape[]>('/api/posts', 'GET', undefined, true);
        if (!result?.success || !result.data) {
          throw new ErrorHandler('Loading posts failure', 500);
        }
        const postPacket = result.data;
        setPosts((prev) => {
          const existing = prev ?? [];
          const newPosts = postPacket.filter((p: IPostShape) => !existing.some((e) => e.id === p.id));
          return [...existing, ...newPosts];
        });
      } catch (error) {
        if (error instanceof ErrorHandler) {
          setNotification('error', error.message);
          throw new ErrorHandler(error.message, error.code);
        } else {
          setNotification('error', 'Unknown message caught on post loading');
          throw error;
        }
      } finally {
        setLoading(false);
      }
    },
    [request],
  );
  useEffect(() => {
    (async () => {
      await refresh();
    })();
  }, [refresh]);

  return { request, refresh, posts, isLoading };
}
