import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../generic/UI/Button/Button';
import style from './Post.module.css';
import { usePost } from '../../../../../hooks/usePost';
import ActivityReactions from '../ActivityReactions/ActivityReactions';
import UserActivityInfo from '../UserActivityInfo/UserActivityInfo';
import type { ReactionUnion } from '../../../../../types/VisualUnions';

interface PostComponent {
  avatar: string | null;
  authorName: string;
  visibility: string;
  createdAt: string;
  content: string;
  reactions: Record<ReactionUnion, number>;
  activeReaction: ReactionUnion;
  id: number;
}

export default function Post({ authorName, visibility, createdAt, content, id }: PostComponent) {
  const postId = useRef<number>(id);
  const postContent = useRef<HTMLDivElement>(null);
  const navigation = useNavigate();
  const { postPacketData } = usePost(id);

  return (
    postPacketData && (
      <div className={style.container}>
        <UserActivityInfo avatar={null} visibility={visibility} authorName={authorName} createdAt={createdAt} />
        <div className={style.contentContainer} onClick={() => navigation(`/post/${postId.current}`)}>
          <div className={style.content} ref={postContent}>
            <span>{content}</span>
          </div>
          {postContent.current && postContent.current.scrollHeight > postContent.current.clientHeight ? (
            <div>
              <span
                style={{
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1.3rem',
                  opacity: '0.7',
                }}
                onClick={() => {
                  navigation(`/post/${postId.current}`);
                }}
              >
                See more...
              </span>
            </div>
          ) : (
            ''
          )}
        </div>
        <div className={style.interactions}>
          <div style={{ width: '100%', display: 'flex', height: '100%' }}>
            <ActivityReactions
              reactions={postPacketData.reactions}
              myReaction={postPacketData.myReaction}
              activityType='POST'
              postId={postId.current}
            />
          </div>
          <Button additionalStyle={{ background: 'none', border: 'none' }} text="Add comment" />
          <Button additionalStyle={{ background: 'none', border: 'none' }} text="Share" />
        </div>
      </div>
    )
  );
}
