import { useCallback, useContext, useState } from "react";
import { useAPI } from "./useAPI";
import type { PostRow } from "../types/Posthook";
import { ErrorHandler } from "../lib/customError";
import { customNotificationCtx } from "../context/customNotificationContext";

export function usePosts() {
  const [posts, setPosts] = useState<PostRow[] | undefined>(undefined);
  const [isLoading, setLoading] = useState<boolean>(true);
  const { request } = useAPI();
  const ctx = useContext(customNotificationCtx);

  const refresh = useCallback(
    async function refresh() {
      setLoading(true);
      try {
        const result = await request<PostRow[]>("/api/posts", "GET");
        if (!result?.success || !result.data) {
          throw new ErrorHandler("Loading posts failure", 500);
        }
        setPosts((prev) => {
          const existing = prev ?? [];
          const newPosts = result.data.filter((p: PostRow) =>
            existing.some((e) => e.postId === p.postId),
          );
          return [...existing, ...newPosts];
        });
      } catch (error) {
        let errorMessage = "Internal server error";
        if (error instanceof ErrorHandler || error instanceof Error) {
          errorMessage = error.message;
        }
        if (ctx) {
          ctx.setNotify({ type: "error", message: errorMessage });
        }
        console.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [request, ctx],
  );

  return { request, refresh, posts, isLoading };
}
