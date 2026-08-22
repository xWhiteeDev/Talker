import style from './ActivityComment.module.css';
import type { ReactionUnion } from '../../../../../types/VisualUnions';
import UserActivityInfo from '../UserActivityInfo/UserActivityInfo';
import ActivityReactions from '../ActivityReactions/ActivityReactions';

interface ActivityCommentProps {
  avatar: string | null;
  authorName: string;
  content: string;
  createdAt: string;
  commentId: number;
  postId: number;
  userReaction: ReactionUnion;
  commentReactions: Record<ReactionUnion, number>;
  subCommentsCount:number
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
  subCommentsCount, //TODO
  onFocus,
}: ActivityCommentProps) {
  return (
    <div className={style.activityCommentContainer}>
      <div className={style.activityUser}>
        <UserActivityInfo avatar={avatar ?? null} authorName={authorName} createdAt={createdAt} />
      </div>
      <div className={style.activityCommentContent}>
        <span>{content}</span>
      </div>
      <div className={style.activityCommentReactions}>
        <ActivityReactions
          myReaction={userReaction}
          reactions={commentReactions}
          activityType="COMMENT"
          postId={postId}
          commentId={commentId}
        />
      </div>
      <div className={style.activityCommentCount} onClick={() => onFocus()}>
        <span>Komentarze: <b>4</b></span>
      </div>
    </div>
  );
}
 // TODO!!