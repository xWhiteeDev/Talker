import { useReaction } from '../../../../../hooks/useReaction';
import type { TReactionUnion } from '../../../../../types/components/IComponentsUnion';
import Reaction from '../Reaction/Reaction';

interface ActivityReactionsProps {
  reactions: Record<TReactionUnion, number>;
  myReaction: TReactionUnion;
  activityType: 'COMMENT' | 'POST';
  postId: number;
  commentId?:number
}

export default function ActivityReactions({ reactions, myReaction, activityType, postId,commentId }: ActivityReactionsProps) {
  const { unifiedReactions, toggle } = useReaction(reactions ?? {}, myReaction);
  const reactionNames = Object.keys(unifiedReactions.counts) as TReactionUnion[];

  return reactionNames.map((v) => (
    <Reaction
      key={v}
      name={v as TReactionUnion}
      count={unifiedReactions.counts[v as TReactionUnion]}
      isActive={unifiedReactions.activeReaction === v}
      onReactionAdd={(name) => toggle(name as TReactionUnion, activityType, postId,commentId)}
    />
  ));
}
