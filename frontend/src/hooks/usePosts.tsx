import { useCallback, useEffect, useState } from 'react';
import { useAPI } from './useAPI';
import { ErrorHandler } from '../lib/customError';
import useNotify from './useNotify';
import type { IPostShape } from '../types/hooks/IPostHook';

export function usePosts() {
  const [posts, setPosts] = useState<IPostShape[] | undefined>(undefined);
  const [isLoading, setLoading] = useState<boolean>(true);
  const { request } = useAPI();
  const { setNotification } = useNotify();
  const refresh = useCallback(
    async function refresh() {
      setLoading(true);
      try {
        const result = await request<IPostShape[]>('/api/posts', 'GET');
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
        let errorMessage = 'Internal server error';
        if (error instanceof ErrorHandler || error instanceof Error) {
          errorMessage = error.message;
        }
        setNotification('error', errorMessage);
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
