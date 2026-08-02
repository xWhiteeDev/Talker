import style from './PostComment.module.css';
import unk_person from '../../../../../../assets/unk_person.png';
import Reaction from '../../Reaction/Reaction';
import type { ReactionUnion } from '../../../../../../types/VisualUnions';
import { useReaction } from '../../../../../../hooks/useReaction';
interface PostCommentProps {
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

const defaultPayload: Record<ReactionUnion, number> = {
  love: 0,
  like: 0,
  wow: 0,
  sad: 0,
  wrr: 0,
};

export function PostComment({
  avatar,
  authorName,
  content,
  createdAt,
  commentId,
  postId,
  commentReactions,
  userReaction,
  onFocus,
}: PostCommentProps) {
  const { toggle, unifiedReactions } = useReaction(defaultPayload, commentReactions,userReaction);
  return unifiedReactions&& ( 
    <div className={style.postCommentContainer}>
      <div className={style.postCommentContent} style={{ cursor: 'pointer' }} onClick={() => onFocus()}>
        <UserInfo avatar={avatar ?? null} authorName={authorName} createdAt={createdAt} />
        <span>{content}</span>
      </div>
      <div className={style.postCommentReactions}>
        {Object.keys(unifiedReactions.counts).map((v) => (
          <Reaction
            name={v}
            count={unifiedReactions.counts[v]}
            isActive={v == unifiedReactions.activeReaction}
            onReactionAdd={(name) => toggle(name, 'COMMENT', postId, commentId)}
          />
        ))}
      </div>
    </div>
  );
}

interface UserPostInfoProps {
  avatar: string | null;
  authorName: string;
  createdAt: string;
}

export default function UserInfo(user: UserPostInfoProps) {
  return (
    <div className={style.user}>
      <div className={style.userAvatar}>
        <img src={user.avatar ?? unk_person} className={style.avatar} alt="user avatar" />
      </div>
      <div className={style.postInfo}>
        <span style={{ fontWeight: '600' }}>{user.authorName}</span>
        <span>{new Date(user.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
}
