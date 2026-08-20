import { useNavigate, useParams } from 'react-router-dom';
import style from './LargeActivityComment.module.css';
import { useAPI } from '../../../../../../hooks/useAPI';
import { useContext, useEffect, useState } from 'react';
import { ErrorHandler } from '../../../../../../lib/customError';
import { customNotificationCtx } from '../../../../../../context/customNotificationContext';
import UserActivityInfo from '../../UserActivityInfo/UserActivityInfo';
import CommentCreator from '../../CommentCreator/CommentCreator';
import ActivityReactions from '../../ActivityReactions/ActivityReactions';
import { ActivityComment } from '../ActivityComment';

interface ActivityComments {
  postId: number;
  id: number;
  userId: number;
  parentId: number;
  content: string;
  createdAt: string;
  fullName: string;
  childComments: ActivityComments[];
}

export function LargeActivityComment() {
  const { commentid, postid } = useParams();
  const { request } = useAPI();
  const [commentData, setCommentData] = useState<ActivityComments | undefined>(undefined);
  const [commentText, setCommentText] = useState<string>();
  const ctx = useContext(customNotificationCtx);
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
        if (ctx) {
          ctx.setNotify({ type: 'error', message: error.message });
        } else {
          console.error(error);
        }
      } else {
        if (ctx) {
          ctx.setNotify({ type: 'error', message: 'Unknown server error!' });
        } else {
          console.error(error);
        }
      }
    }
  }
  useEffect(() => {
    request<ActivityComments>(`/api/comments/${commentid}`, 'GET')
      .then((res) => {
        if (!res || !res.success) {
          throw new ErrorHandler('Failed to fetch comment', 400);
        }
        if (res.data) {
          setCommentData(res.data);
          console.log(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [commentid, request]);
  return (
    commentData && (
      <div className={style.container}>
        <div className={style.userInfoContainer}>
          {commentData && <UserActivityInfo avatar={null} authorName={commentData.fullName} createdAt={commentData.createdAt} />}
        </div>
        <div className={style.contentContainer}>{commentData.content}</div>
        <div className={style.reactionsContainer}>
          <ActivityReactions />
        </div>

        <div className={style.commentCreatorContanier}>
          <CommentCreator
            onEditableTextAreaChange={(text: string) => setCommentText(text)}
            text={commentText ?? ''}
            onSubmit={addComment}
          />
        </div>
        <div className={style.childComments}>
          {commentData &&
            commentData.childComments.map((v) => (
              <ActivityComment
                avatar={null}
                authorName={v.fullName}
                createdAt={v.createdAt}
                content={v.content}
                commentId={v.id}
                postId={v.postId}
                userReaction={'like'}
                commentReactions={{}}
                onFocus={() => nav(`/post/${v.postId}/comments/${v.id}`)}
              />
            ))}
        </div>
      </div>
    )
  );
}
