import { useCallback, useState } from 'react';
import type { ReactionHookUnionType, ReactionUnion } from '../types/VisualUnions';
import { useAPI } from './useAPI';
import { ErrorHandler } from '../lib/customError';
import useNotify from './useNotify';

const defaultReactions: Record<ReactionUnion, number> = {
  love: 0,
  like: 0,
  wow: 0,
  wrr: 0,
  sad: 0,
};

export function useReaction(serverReactions: Partial<Record<ReactionUnion, number>>, userReaction?: ReactionUnion) {
  const [unifiedReactions, setUnifiedReactions] = useState<{
    counts: Record<ReactionUnion, number>;
    activeReaction: ReactionUnion | undefined;
  }>({
    counts: { ...defaultReactions, ...serverReactions },
    activeReaction: userReaction ?? undefined,
  });
  const { request } = useAPI();
  const { setNotification } = useNotify();
  const toggle = useCallback(
    async function toggle(newReactionName: ReactionUnion, column: ReactionHookUnionType, postId: number, commentId?: number) {
      const hookData = {
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
        setNotification('error', errorMessage);
      }
    },
    [request],
  );
  return { unifiedReactions, toggle };
}
