import style from "./Post.module.css";
import unk_person from "../../assets/unk_person.png";
import Button from "../Button/Button";
import type { PostComponent, ReactionUnion } from "./types";
import { useContext, useRef, useState } from "react";
import { useAPI } from "../../hooks/useAPI";
import { postReactionContext } from "./context/postReactionContext";
import Reaction from "./Reaction";
import { NotificationContext } from "../Notification/context/NotificationContext";
import { ErrorHandler } from "../../lib/customError";

export default function Post({
  authorName,
  visibility,
  createdAt,
  content,
  reactions,
  id,
}: PostComponent) {
  const post = useRef<number>(id);
  const { request } = useAPI();
  const [activeReactionName, setActiveReactionName] = useState<
    ReactionUnion | undefined
  >(undefined);
  const [reactionCounts, setReactionCount] = useState<
    Record<ReactionUnion, number>
  >({ like: 0, love: 0, wow: 0, wrr: 0, sad: 0 });

  const notificationContext = useContext(NotificationContext);
  async function addReaction(name: ReactionUnion): Promise<unknown> {
    if (activeReactionName) {
      const deletingResult = await removeReaction(activeReactionName);
      if (!deletingResult) {
        return;
      }
    }
    if (activeReactionName === name) {
      setActiveReactionName(undefined);
      return;
    }
    try {
      const result = await request<boolean>("/api/postReactions", "POST", {
        postId: post.current,
        type: name,
      });
      if (result?.success) {
        setActiveReactionName(name);
        setReactionCount((prev) => ({ ...prev, [name]: prev[name] + 1 }));
      }
      return result?.success;
    } catch (error) {
      handleServerError(error);
    }
  }
  async function removeReaction(
    name: ReactionUnion,
  ): Promise<boolean | undefined> {
    try {
      const result = await request<boolean>("/api/postReactions", "DELETE", {
        postId: post.current,
        type: name,
      });
      if (result?.success) {
        setReactionCount((prev) => ({
          ...prev,
          [name]: prev[name] - 1,
        }));
      }
      return result?.success;
    } catch (error) {
      handleServerError(error);
    }
  }

  function handleServerError(error: unknown) { //TODO: In future diversify this function to separated file.
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
    <div className={style.container}>
      <div className={style.user}>
        <div className={style.userAvatar}>
          <img src={unk_person} className={style.avatar} alt="user avatar" />
        </div>
        <div className={style.postInfo}>
          <span style={{ fontWeight: "600" }}>{authorName}</span>
          <span>{visibility}</span>
          <span>{new Date(createdAt).toLocaleString()}</span>
        </div>
      </div>
      <div className={style.content}>
        <span>{content}</span>
      </div>
      <div className={style.interactions}>
        <div style={{ width: "100%", display: "flex", height: "100%" }}>
          <postReactionContext.Provider value={{ addReaction }}>
            {reactions.map((v, i) => (
              <Reaction
                key={v.name + i}
                name={v.name}
                isActive={v.name === activeReactionName}
                onReactionAdd={(name) => addReaction(name as ReactionUnion)}
                count={reactionCounts[v.name]}
              />
            ))}
          </postReactionContext.Provider>
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
  );
}
