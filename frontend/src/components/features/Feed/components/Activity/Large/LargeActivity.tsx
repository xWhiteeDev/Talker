import { useNavigate, useParams } from 'react-router-dom';
import style from './LargeActivity.module.css';
import { useAPI } from '../../../../../../hooks/useAPI';
import { useEffect, useState } from 'react';
import { ErrorHandler } from '../../../../../../lib/customError';
import UserActivityInfo from '../../UserActivityInfo/UserActivityInfo';
import CommentCreator from '../../CommentCreator/CommentCreator';
import ActivityReactions from '../../ActivityReactions/ActivityReactions';
import { Activity } from '../Activity';
import type { TReactionUnion } from '../../../../../../types/components/IComponentsUnion';

interface ActivityElements {
  postId: number;
  id: number;
  userId: number;
  parentId: number;
  content: string;
  createdAt: string;
  fullName: string;
  reactions: Record<TReactionUnion, number>;
  myReaction: TReactionUnion;
  commentsCount: number;
  comments: ActivityElements[];
}

export function LargeActivity() {
  const { commentid, postid } = useParams<string>();
  const { request } = useAPI();
  const [activityData, setActivityData] = useState<ActivityElements | undefined>(undefined);
  const [commentText, setCommentText] = useState<string>();
  const nav = useNavigate();

  async function addComment() {
    //TODO: ADD PARAMETERS CHECKING
    const result = await request('/api/comments', 'POST', {
      postId: +postid,
      parentId: +commentid,
      content: commentText,
    });
    if (!result || !result.success) {
      throw new ErrorHandler(`Adding commment fault for ${+commentid} `, 500);
    }
  }
  useEffect(() => {
    const query: string = commentid === undefined && postid ? `/api/posts/${postid}` : `/api/comments/${commentid}`;
    (async () => {
      const res = await request<ActivityElements>(query, 'GET');
      if (!res || !res.success) {
        throw new ErrorHandler('Failed to fetch comment', 400);
      }
      if (res.data) {
        setActivityData(res.data);
      }
    })();
  }, [commentid, request, postid]);
  return (
    activityData && (
      <div className={style.container}>
        <div className={style.goBack}>
          <span onClick={() => nav(-1)} style={{ cursor: 'pointer' }}>
            X
          </span>
        </div>
        <div className={style.userInfoContainer}>
          {activityData && (
            <UserActivityInfo avatar={null} authorName={activityData.fullName} createdAt={activityData.createdAt} />
          )}
        </div>
        <div className={style.contentContainer}>{activityData.content}</div>
        <div className={style.reactionsContainer}>
          {postid && (
            <ActivityReactions
              reactions={activityData.reactions}
              postId={+postid}
              activityType={commentid === undefined && postid ? 'POST' : 'COMMENT'}
              myReaction={activityData.myReaction}
            />
          )}
        </div>

        <div className={style.commentCreatorContanier}>
          <CommentCreator
            onEditableTextAreaChange={(text: string) => setCommentText(text)}
            text={commentText ?? ''}
            onSubmit={addComment}
          />
        </div>
        <div className={style.childComments}>
          {activityData &&
            postid &&
            activityData.comments.map((v) => (
              <Activity
                key={v.id}
                type="COMMENT"
                avatar={null}
                authorName={v.fullName}
                createdAt={v.createdAt}
                content={v.content}
                commentId={v.id}
                postId={+postid}
                userReaction={v.myReaction}
                commentReactions={v.reactions}
                subCommentsCount={v.commentsCount}
                onFocus={() => nav(`/post/${+postid}/comments/${v.id}`)}
              />
            ))}
        </div>
      </div>
    )
  );
}
