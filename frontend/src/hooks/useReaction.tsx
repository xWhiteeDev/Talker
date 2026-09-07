import { useCallback, useState } from 'react';
import type { TReactionHookUnionType, TReactionUnion } from '../types/components/IComponentsUnion';
import { useAPI } from './useAPI';
import { ErrorHandler } from '../lib/customError';

const defaultReactions: Record<TReactionUnion, number> = {
  love: 0,
  like: 0,
  wow: 0,
  wrr: 0,
  sad: 0,
};

export function useReaction(serverReactions: Partial<Record<TReactionUnion, number>>, userReaction?: TReactionUnion) {
  const [unifiedReactions, setUnifiedReactions] = useState<{
    counts: Record<TReactionUnion, number>;
    activeReaction: TReactionUnion | undefined;
  }>({
    counts: { ...defaultReactions, ...serverReactions },
    activeReaction: userReaction ?? undefined,
  });
  const { request } = useAPI();
  const toggle = useCallback(
    async function toggle(newReactionName: TReactionUnion, column: TReactionHookUnionType, postId: number, commentId?: number) {
      const hookData = {
        endpoint: '',
        data: {},
      };
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
    },
    [request],
  );
  return { unifiedReactions, toggle };
}
