import { useReaction } from '../../../../../hooks/useReaction';
import type { ReactionUnion } from '../../../../../types/VisualUnions';
import Reaction from '../Reaction/Reaction';

interface ActivityReactionsProps {
  reactions: Record<ReactionUnion, number>;
  myReaction: ReactionUnion;
  activityType: 'COMMENT' | 'POST';
  postId: number;
  commentId?:number
}

export default function ActivityReactions({ reactions, myReaction, activityType, postId,commentId }: ActivityReactionsProps) {
  const { unifiedReactions, toggle } = useReaction(reactions ?? {}, myReaction);
  const reactionNames = Object.keys(unifiedReactions.counts) as ReactionUnion[];

  return reactionNames.map((v) => (
    <Reaction
      key={v}
      name={v as ReactionUnion}
      count={unifiedReactions.counts[v as ReactionUnion]}
      isActive={unifiedReactions.activeReaction === v}
      onReactionAdd={(name) => toggle(name as ReactionUnion, activityType, postId,commentId)}
    />
  ));
}
