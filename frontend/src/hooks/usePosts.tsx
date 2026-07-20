import { useState } from "react";
import { useAPI } from "./useAPI";
import type { PostRow } from "./types";

const postData: PostRow[] = [];

export function usePosts() {
  const [posts, setPosts] = useState<PostRow[] | undefined>(undefined);
  const { request } = useAPI();

  async function refresh() {
    const result = await request<PostRow[]>("/api/posts", "GET");
    if (result && result.success) {
      if (result.data) {
        setPosts((prev) => {
          const existing = prev ?? [];
          const newPosts = result.data!.filter(
            (p) => !existing.some((e) => e.id === p.id),
          );
          return [...existing, ...newPosts];
        });
      }
    }
  }
  return { request, refresh, posts };
}
