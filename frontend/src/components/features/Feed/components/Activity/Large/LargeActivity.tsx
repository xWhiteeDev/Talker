import { useNavigate, useParams } from 'react-router-dom';
import style from './LargeActivity.module.css';
import { useAPI } from '../../../../../../hooks/useAPI';
import { useEffect, useState } from 'react';
import { ErrorHandler } from '../../../../../../lib/customError';
import UserActivityInfo from '../../UserActivityInfo/UserActivityInfo';
import CommentCreator from '../../CommentCreator/CommentCreator';
import ActivityReactions from '../../ActivityReactions/ActivityReactions';
import { Activity } from '../Activity';
import type { ReactionUnion } from '../../../../../../types/VisualUnions';
import useNotify from '../../../../../../hooks/useNotify';

interface ActivityElements {
  postId: number;
  id: number;
  userId: number;
  parentId: number;
  content: string;
  createdAt: string;
  fullName: string;
  reactions: Record<ReactionUnion, number>;
  myReaction: ReactionUnion;
  commentsCount: number;
  comments: ActivityElements[];
}

export function LargeActivity() {
  const { commentid, postid } = useParams();
  const { request } = useAPI();
  const [activityData, setActivityData] = useState<ActivityElements | undefined>(undefined);
  const [commentText, setCommentText] = useState<string>();
  const { setNotification } = useNotify();
  const nav = useNavigate();

  async function addComment() {
    try {
      const result = await request('/api/comments', 'POST', {
        postId: +postid!,
        parentId: commentid,
        content: commentText,
      });
      if (!result || !result.success) {
        throw new ErrorHandler(`Adding commment fault for ${commentid} `, 500);
      }
    } catch (error) {
      if (error instanceof ErrorHandler) {
        setNotification('error', error.message);
      } else {
        setNotification('error', 'Unknown server error!');
      }
    }
  }
  useEffect(() => {
    const query: string = commentid === undefined && postid ? `/api/posts/${postid}` : `/api/comments/${commentid}`;
    request<ActivityElements>(query, 'GET')
      .then((res) => {
        if (!res || !res.success) {
          throw new ErrorHandler('Failed to fetch comment', 400);
        }
        if (res.data) {
          setActivityData(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [commentid, request]);
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
