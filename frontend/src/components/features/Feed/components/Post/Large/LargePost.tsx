import { Outlet, useMatch, useNavigate, useParams } from 'react-router-dom';
import Button from '../../../../../generic/UI/Button/Button';
import style from './LargePost.module.css';
import { usePost } from '../../../../../../hooks/usePost';
import CustomText from '../../../../../generic/UI/Text/Text';
import type { ReactionUnion } from '../../../../../../types/VisualUnions';
import { Loading } from '../../../../../generic/UI/Loading/Loading';
import { useContext, useState } from 'react';
import { useAPI } from '../../../../../../hooks/useAPI';
import { ErrorHandler } from '../../../../../../lib/customError';
import { customNotificationCtx } from '../../../../../../context/customNotificationContext';
import UserActivityInfo from '../../UserActivityInfo/UserActivityInfo';
import ActivityReactions from '../../ActivityReactions/ActivityReactions';
import  CommentCreator from '../../CommentCreator/CommentCreator';
import { ActivityComment } from '../../Comment/ActivityComment';

export default function LargePost() {
  const { postid } = useParams();
  const [commentText, setCommentText] = useState<string | undefined>(undefined);

  const { err, loading, postPacketData, refetch } = usePost(+postid!);
  const { request } = useAPI();
  const nav = useNavigate();
  const ctx = useContext(customNotificationCtx);
  const isShowingComment = useMatch('/post/:postid/comments/:commentid');
  async function addComment() {
    try {
      const result = await request('/api/comments', 'POST', {
        postId: +postid!,
        parentId: null,
        content: commentText,
      });
      if (!result || !result.success) {
        throw new ErrorHandler(`Adding commment fault for ${postid} `, 500);
      }
      await refetch();
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

  return err ? (
    <div>{err}</div>
  ) : !loading ? (
    postPacketData &&
    postid && (
      <div className={style.expandedContainer}>
        <Button
          text="X"
          additionalStyle={{
            position: 'absolute',
            height: '4%',
            background: 'none',
            border: 'none',
            aspectRatio: '1/1',
            right: '0',
          }}
          onClick={() => nav(-1)}
        />
        {isShowingComment ? (
          <Outlet />
        ) : (
          <>
            <div className={style.expandedUserContainer}>
              <UserActivityInfo
                avatar={null}
                visibility={postPacketData.visibleFor}
                authorName={postPacketData.fullName}
                createdAt={postPacketData.created_at}
              />
            </div>
            <div className={style.expandedContentContainer}>{postPacketData.content}</div>
            <div className={style.expandedReactions}>
              <ActivityReactions
                activityId={+postid}
                activityType='POST'
                reactions={postPacketData.reactions as Record<ReactionUnion, number>}
                myReaction={postPacketData.myReaction as ReactionUnion}
              />
            </div>
            <div className={style.expandedCommentsContainer}>
              <CommentCreator
                onEditableTextAreaChange={(text) => setCommentText(text)}
                text={commentText ?? ''}
                onSubmit={addComment}
              />
              {!postPacketData.comments ? (
                <CustomText
                  text="No one wrote comments..."
                  bottomText="Yet"
                  additionalStyle={{
                    fontWeight: 600,
                    opacity: 0.8,
                    textAlign: 'center',
                    textShadow: '4px 1px 1px #89a4fd7a',
                  }}
                />
              ) : (
                postPacketData.comments.map((v) => (
                  <ActivityComment
                    key={v.commentId}
                    avatar={null}
                    authorName={v.fullName}
                    content={v.content}
                    onFocus={() => nav(`comments/${v.commentId}`)}
                    createdAt={v.createdAt}
                    postId={+postid}
                    commentId={v.commentId}
                    commentReactions={v.reactions}
                    userReaction={v.userReaction}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    )
  ) : (
    <Loading />
  );
}
