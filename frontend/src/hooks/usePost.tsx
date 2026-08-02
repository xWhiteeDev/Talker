import { useCallback, useEffect, useState } from "react";
import { ErrorHandler } from "../lib/customError";
import { useAPI } from "./useAPI";
import type { PostReaction } from "../components/features/Feed/components/Post/types";
interface ReactionCount {
  [key: string]: number;
}

interface Comment {
  content:string;
  fullName:string;
  commentId:number;
  createdAt:string
}

interface PostRow {
  postId: number;
  author_Id: number;
  content: string;
  created_at: string;
  visibleFor: string;
  fullName: string;
  comments: Comment[] | null;
  reactions: ReactionCount;
  myReaction: string | null;
}

export function usePost(postId: number) {
  const { request } = useAPI();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<any>(undefined);
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
