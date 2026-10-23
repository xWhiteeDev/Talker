import { useState } from 'react';
import { useAPI } from './useAPI';
import type { IPost } from '../types/components/IPost';
import { EmitError } from '../lib/Error/EmitError';

export function usePosts() {
  const { request } = useAPI();
  const [latestPosts, setPosts] = useState<IPost[] | undefined>(undefined);
  const [isLoading, setLoading] = useState<boolean>(true);
  const refresh = async () => {
    try {
      const result = await request<IPost[]>('/api/posts/', 'GET');
      if (!result.success || !result.data) {
        console.log('failed to get')
        throw new EmitError(500, 'Cannot load posts!');
      }
      console.log(result.data)
      setPosts(result.data);
    } catch (error) {
        console.log(error)
    } finally {
      setLoading(false);
    }
  };
  const clear = () => {
    setPosts(undefined)
  }
  return { refresh, isLoading, latestPosts,clear };
}
