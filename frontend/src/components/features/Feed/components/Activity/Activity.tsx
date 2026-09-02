import style from './Activity.module.css';
import type { ReactionUnion } from '../../../../../types/VisualUnions';
import UserActivityInfo from '../UserActivityInfo/UserActivityInfo';
import ActivityReactions from '../ActivityReactions/ActivityReactions';
import {memo} from 'react';

interface ActivityProps {
  avatar: string | null;
  authorName: string;
  content: string;
  createdAt: string;
  postId: number;
  userReaction: ReactionUnion;
  commentReactions: Record<ReactionUnion, number>;
  subCommentsCount: number;
  onFocus(): void;
  commentId?: number;
  type:'POST' | 'COMMENT'
}

export const Activity = memo(function Activity({
  type,
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
}: ActivityProps) {
  return (
    <div className={style.activityContainer}>
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
          activityType={type}
          postId={postId}
          commentId={commentId}
        />
      </div>
      <div className={style.activityCommentCount} onClick={() => onFocus()}>
        <span>
          Comments: <b>{subCommentsCount}</b>
        </span>
      </div>
    </div>
  );
})

