import { useCallback, useContext, useState } from 'react';
import type { ReactionHookUnionType, ReactionUnion } from '../types/VisualUnions';
import { useAPI } from './useAPI';
import { customNotificationCtx } from '../context/customNotificationContext';
import { ErrorHandler } from '../lib/customError';

export function useReaction(
  initialReactions: Record<ReactionUnion, number>,
  serverReactions: Partial<Record<ReactionUnion, number>>,
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
    async function toggle(newReactionName: ReactionUnion, column: ReactionHookUnionType, postId: number, commentId?: number) {
      let hookData = {
        endpoint: '',
        data: {},
      };
      try {
        if (column === 'POST') {
          hookData.endpoint = '/api/postReactions/';
          hookData.data = { type: newReactionName, postId: postId };
        } else if (column === 'COMMENT') {
          hookData.endpoint = '/api/commentReactions/';
          hookData.data = {
            type: newReactionName,
            postId: postId,
            commentId: commentId,
          };
        }
        const result = await request<boolean>(hookData.endpoint, 'POST', hookData.data);
        if (!result || !result.success) {
          throw new ErrorHandler(`Reaction request failed for ${column}`, 500);
        }
        setUnifiedReactions((prev) => {
          const next = { ...prev };
          const reactionCounts = { ...prev.counts };
          if (next.activeReaction) {
            if (next.activeReaction == newReactionName) {
              reactionCounts[next.activeReaction] -= 1;
              next.activeReaction = undefined;
              return {
                counts: reactionCounts,
                activeReaction: undefined,
              };
            }
            reactionCounts[next.activeReaction] -= 1;
          }
          reactionCounts[newReactionName] += 1;
          next.activeReaction = newReactionName;
          return {
            counts: reactionCounts,
            activeReaction: next.activeReaction,
          };
        });
      } catch (error) {
        let errorMessage: string = 'Reaction adding problem. Try again later.';
        if (error instanceof ErrorHandler || error instanceof Error) {
          errorMessage = error.message;
        }
        if (notiCtx) {
          notiCtx.setNotify({
            type: 'error',
            message: errorMessage,
          });
        } else {
          console.error(error);
        }
      }
    },
    [request, notiCtx],
  );
  return { unifiedReactions, toggle };
}
