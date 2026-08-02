import { useCallback, useContext, useState } from "react";
import type { ReactionUnion } from "../types/VisualUnions";
import { useAPI } from "./useAPI";
import { customNotificationCtx } from "../context/customNotificationContext";
import { ErrorHandler } from "../lib/customError";

export function useReaction(
  initialReactions: Record<ReactionUnion, number>,
  serverReactions: Partial<Record<ReactionUnion, number>>,
  postId: number,
  userReaction?: ReactionUnion,
  ) {
    const [unifiedReactions, setUnifiedReactions] = useState<{
      counts: Record<ReactionUnion, number>;
      activeReaction: ReactionUnion | undefined;
    }>({
      counts: { ...initialReactions, ...serverReactions },
      activeReaction: userReaction ?? undefined,
    });
    const notiCtx = useContext(customNotificationCtx);
    const { request } = useAPI();

    const toggle = useCallback(
      async function toggle(name: ReactionUnion) {
        try {
          const result = await request<boolean>("/api/postReactions/", "POST", {
            type: name,
            postId: postId,
          });
          if (!result || !result.success) {
            throw new ErrorHandler(`Reaction request failed for post ${postId}`, 500);
          }
          setUnifiedReactions((prev) => {
            const next = { ...prev };
            const reactionCounts = { ...prev.counts };
            if (next.activeReaction) {
              if (next.activeReaction === name) {
                reactionCounts[next.activeReaction] -= 1;
                next.activeReaction = undefined;
                return {
                  counts: reactionCounts,
                  activeReaction: next.activeReaction,
                };
              }
              reactionCounts[next.activeReaction] -= 1;
            }
            reactionCounts[name] += 1;
            next.activeReaction = name;
            return {
              counts: reactionCounts,
              activeReaction: next.activeReaction,
            };
          });
        } catch (error) {
          let errorMessage:string = 'Reaction adding problem. Try again later.'
          if (error instanceof ErrorHandler || error instanceof Error) {
            errorMessage = error.message
          }
          if (notiCtx) {
            notiCtx.setNotify({
              type: "error",
              message: errorMessage,
            });
          } else {
            console.error(error);
          }
        }
      },
      [request, notiCtx,postId],
    );
    return { unifiedReactions, toggle };
  }
