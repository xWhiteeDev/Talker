import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorHandler } from "../../../../../lib/customError";
import type { ReactionUnion } from "../../../../../types/VisualUnions";
import { customNotificationCtx } from "../../../../../context/customNotificationContext";
import Button from "../../../../generic/UI/Button/Button";
import Reaction from "../Reaction/Reaction";
import UserPostInfo from "./User";

import style from "./Post.module.css";
import { useReaction } from "../../../../../hooks/useReaction";
import { usePost } from "../../../../../hooks/usePost";
interface PostComponent {
  avatar: string | null;
  authorName: string;
  visibility: string;
  createdAt: string;
  content: string;
  reactions: Record<string, number>;
  activeReaction: string;
  id: number;
}

const defaultReactions: Record<ReactionUnion, number> = {
  love: 0,
  like: 0,
  wow: 0,
  wrr: 0,
  sad: 0,
};

export default function Post({
  authorName,
  visibility,
  createdAt,
  content,
  id,
}: PostComponent) {
  const postId = useRef<number>(id);
  const postContent = useRef<HTMLDivElement>(null);
  const navigation = useNavigate();
  const { postPacketData } = usePost(id);
  const notificationContext = useContext(customNotificationCtx);
  console.log();

  function handleServerError(error: unknown) {
    //TODO: In future diversify this function to separated file.
    if (error instanceof ErrorHandler) {
      notificationContext?.setNotify({
        type: "error",
        message: error.message,
      });
    } else {
      notificationContext?.setNotify({
        type: "error",
        message: "Unknown server error",
      });
    }
  }

  return (
    postPacketData && (
      <div className={style.container}>
        <UserPostInfo
          avatar={null}
          visibility={visibility}
          authorName={authorName}
          createdAt={createdAt}
        />
        <div
          className={style.contentContainer}
          onClick={() => navigation(`/post/${postId.current}`)}
        >
          <div className={style.content} ref={postContent}>
            <span>{content}</span>
          </div>
          {postContent.current &&
          postContent.current.scrollHeight >
            postContent.current.clientHeight ? (
            <div>
              <span
                style={{
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "1.3rem",
                  opacity: "0.7",
                }}
                onClick={() => {
                  navigation(`/post/${postId.current}`);
                }}
              >
                See more...
              </span>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className={style.interactions}>
          <div style={{ width: "100%", display: "flex", height: "100%" }}>
            <PostReactions
              reactions={
                postPacketData.reactions as Record<ReactionUnion, number>
              }
              myReaction={postPacketData.myReaction as ReactionUnion}
              postId={postId.current}
            />
          </div>
          <Button
            additionalStyle={{ background: "none", border: "none" }}
            text="Add comment"
          />
          <Button
            additionalStyle={{ background: "none", border: "none" }}
            text="Share"
          />
        </div>
      </div>
    )
  );
}
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
