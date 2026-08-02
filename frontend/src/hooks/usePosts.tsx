import { useState } from "react";
import { useAPI } from "./useAPI";
import type {PostRow} from "../types/Posthook";


export function usePosts() {
  const [posts, setPosts] = useState<PostRow[] | undefined>(undefined);
  const [isLoading, setLoading] = useState<boolean>(true)
  const { request } = useAPI();

  async function refresh() {
    setLoading(true)
    const result = await request<PostRow[]>("/api/posts", "GET");
    if (result && result.success) {
      if (result.data) {
        setPosts((prev) => {
          const existing = prev ?? [];
          const newPosts = result.data!.filter(
            (p:PostRow) => !existing.some((e) => e.postId === p.postId),
          );
          return [...existing, ...newPosts];
        });
        setLoading(false)
      }
    }
  }
  return { request, refresh, posts ,isLoading};
}
