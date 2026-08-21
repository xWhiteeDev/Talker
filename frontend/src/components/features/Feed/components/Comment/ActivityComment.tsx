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
  return ( 
    <div className={style.activityCommentContainer}>
      <div className={style.activityCommentContent} onClick={() => onFocus()}>
        <UserActivityInfo avatar={avatar ?? null} authorName={authorName} createdAt={createdAt} />
        <span>{content}</span>
      </div>
      <div className={style.activityCommentReactions}>
       <ActivityReactions myReaction={userReaction} reactions={commentReactions} activityType='COMMENT' postId={postId} commentId={commentId}/>
      </div>
    </div>
  );
}