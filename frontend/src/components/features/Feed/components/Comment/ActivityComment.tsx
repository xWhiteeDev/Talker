import style from './ActivityComment.module.css';
import Reaction from '../Reaction/Reaction';
import type { ReactionUnion } from '../../../../../types/VisualUnions';
import { useReaction } from '../../../../../hooks/useReaction';
import UserActivityInfo from '../UserActivityInfo/UserActivityInfo';

interface ActivityCommentProps {
  avatar: string | null;
  authorName: string;
  content: string;
  createdAt: string;
  commentId: number;
  postId: number;
  userReaction: ReactionUnion;
  commentReactions: Partial<Record<ReactionUnion, number>>;
  onFocus(): void;
}


export function ActivityComment({
  avatar,
  authorName,
  content,
  createdAt,
  commentId,
  postId,
  commentReactions,
  userReaction,
  onFocus,
}: ActivityCommentProps) {
  const { toggle, unifiedReactions } = useReaction(commentReactions,userReaction);
  return unifiedReactions&& ( 
    <div className={style.activityCommentContainer}>
      <div className={style.activityCommentContent} onClick={() => onFocus()}>
        <UserActivityInfo avatar={avatar ?? null} authorName={authorName} createdAt={createdAt} />
        <span>{content}</span>
      </div>
      <div className={style.activityCommentReactions}>
        {Object.keys(unifiedReactions.counts).map((v) => (
          <Reaction
            name={v as ReactionUnion}
            count={unifiedReactions.counts[v as ReactionUnion]}
            isActive={v == unifiedReactions.activeReaction}
            onReactionAdd={(name) => toggle(name as ReactionUnion, 'COMMENT', postId, commentId)}
          />
        ))}
      </div>
    </div>
  );
}