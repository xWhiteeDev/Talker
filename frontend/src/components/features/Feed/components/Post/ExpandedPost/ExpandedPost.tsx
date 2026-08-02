import { Outlet, useMatch, useNavigate, useParams } from "react-router-dom";
import Button from "../../../../../generic/UI/Button/Button";
import Reaction from "../../Reaction/Reaction";
import UserPostInfo from "../User";
import style from "./ExpandedPost.module.css";
import { usePost } from "../../../../../../hooks/usePost";
import CustomText from "../../../../../generic/UI/Text/Text";
import type { ReactionUnion } from "../../../../../../types/VisualUnions";
import { useReaction } from "../../../../../../hooks/useReaction";
import { Loading } from "../../../../../generic/UI/Loading/Loading";
import { PostComment } from "../Comments/PostComment";
import EditableTextArea from "../../../../../generic/UI/EditableTextArea/EditableTextArea";
import { useContext, useState } from "react";
import { useAPI } from "../../../../../../hooks/useAPI";
import { ErrorHandler } from "../../../../../../lib/customError";
import { customNotificationCtx } from "../../../../../../context/customNotificationContext";

const defaultReactions: Record<ReactionUnion, number> = {
  love: 0,
  like: 0,
  wow: 0,
  wrr: 0,
  sad: 0,
};

export const ExpandedPost = () => {
  let { postid } = useParams();
  const [commentText, setCommentText] = useState<string | undefined>(undefined);

  const { err, loading, postPacketData } = usePost(+postid);
  const { request } = useAPI();
  const nav = useNavigate();
  const ctx = useContext(customNotificationCtx);
  const isShowingComment = useMatch("/post/:postid/comments/:commentid");
  async function addComment() {
    try {
      const result = await request("/api/comments", "POST", {
        postId: +postid,
        parentId: null,
        content: commentText,
      });
      if (!result || !result.success) {
        throw new ErrorHandler(`Adding commment fault for ${postid} `, 500);
      }
    } catch (error) {
      if (error instanceof ErrorHandler) {
        if (ctx) {
          ctx.setNotify({ type: "error", message: error.message });
        } else {
          console.error(error);
        }
      } else {
        if (ctx) {
          ctx.setNotify({ type: "error", message: "Unknown server error!" });
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
            position: "absolute",
            height: "4%",
            background: "none",
            border: "none",
            aspectRatio: "1/1",
            right: "0",
          }}
          onClick={() => nav(-1)}
        />
        {isShowingComment ? (
          <Outlet />
        ) : (
          <>
            <div className={style.expandedUserContainer}>
              <UserPostInfo
                avatar={null}
                visibility={postPacketData.visibleFor}
                authorName={postPacketData.fullName}
                createdAt={postPacketData.created_at}
              />
            </div>
            <div className={style.expandedContentContainer}>
              {postPacketData.content}
            </div>
            <div className={style.expandedReactions}>
              <PostReactions
                postId={+postid}
                reactions={
                  postPacketData.reactions as Record<ReactionUnion, number>
                }
                myReaction={postPacketData.myReaction as ReactionUnion}
              />
            </div>
            <div className={style.expandedCommentsContainer}>
              <PostCommentCreator
                onEditableTextAreaChange={(text) => setCommentText(text)}
                text={commentText ?? ""}
                onSubmit={addComment}
              />
              {!postPacketData.comments ? (
                <CustomText
                  text="No one wrote comments..."
                  bottomText="Yet"
                  additionalStyle={{
                    fontWeight: 600,
                    opacity: 0.8,
                    textAlign: "center",
                    textShadow: "4px 1px 1px #89a4fd7a",
                  }}
                />
              ) : (
                postPacketData.comments.map((v) => (
                  <PostComment
                  key={v.commentId}
                    avatar={null}
                    authorName={v.fullName}
                    content={v.content}
                    onFocus={() => nav(`comments/${v.commentId}`)}
                    createdAt={new Date(v.createdAt).toLocaleString()}
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
};

interface ServerReactionsProps {
  reactions: Record<ReactionUnion, number>;
  myReaction: ReactionUnion;
  postId: number;
}

const PostReactions = ({
  reactions,
  myReaction,
  postId,
}: ServerReactionsProps) => {
  const { unifiedReactions, toggle } = useReaction(
    defaultReactions,
    reactions ?? {},
    postId,
    myReaction,
  );
  const reactionNames = Object.keys(unifiedReactions.counts) as ReactionUnion[];

  return reactionNames.map((v) => (
    <Reaction
      key={v}
      name={v as ReactionUnion}
      count={unifiedReactions.counts[v as ReactionUnion]}
      isActive={unifiedReactions.activeReaction === v}
      onReactionAdd={toggle}
    />
  ));
};

interface PostCommentCreatorProps {
  onSubmit(): void;
  onEditableTextAreaChange?(text: string): void;
  text: string;
}

const PostCommentCreator = ({
  onSubmit,
  text,
  onEditableTextAreaChange,
}: PostCommentCreatorProps) => {
  return (
    <div className={style.expandedCommentsCreator}>
      <EditableTextArea
        max={255}
        placeholder="+ Add comment"
        placeholderFontWeight="600"
        placeholderFontSize="1rem"
        additionalStyle={{ height: "auto", padding: "0.4em" }}
        onInput={(text) =>
          onEditableTextAreaChange && onEditableTextAreaChange(text)
        }
      />
      {text && text.length > 0 && (
        <Button
          text="Add comment"
          additionalStyle={{
            width: "18%",
            border: "none",
            backgroundColor: " rgba(231, 236, 238, 0.18)",
            boxShadow: "2px 1px 2px 1.2px #71a0ccb0",
            color: "rgb(49, 49, 49)",
            borderRadius: "10px",
            padding: "0.5rem",
          }}
          onClick={() => onSubmit()}
        />
      )}
    </div>
  );
};
