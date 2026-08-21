import { useCallback, useEffect, useState } from "react";
import { ErrorHandler } from "../lib/customError";
import { useAPI } from "./useAPI";
import type {PostRow} from "../types/Posthook";

export function usePost(postId: number) {
  const { request } = useAPI();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<unknown>(undefined);
  const [postPacketData, setPostPacketData] = useState<PostRow | undefined>(
    undefined,
  );
  
  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const postRow = await request<PostRow>(`/api/posts/${postId}`, "GET");
      if (!postRow || !postRow.success || !postRow.data) {
        throw new ErrorHandler("Request failed", 500);
      }

      setPostPacketData(postRow.data);
    } catch (error) {
      setErr(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [postId, request]);
  useEffect(() => {
    fetch();
  }, []);
  return { err, loading, postPacketData, refetch: fetch };
}
