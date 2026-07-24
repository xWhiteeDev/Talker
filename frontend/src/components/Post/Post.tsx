import style from "./Post.module.css";
import unk_person from "../../assets/unk_person.png";
import Button from "../Button/Button";
import type { PostReaction, PostComponent, ReactionUnion } from "./types";
import { useContext, useEffect, useRef, useState } from "react";
import { useAPI } from "../../hooks/useAPI";
import { postReactionContext } from "./context/postReactionContext";
import Reaction from "./Reaction";
import { NotificationContext } from "../Notification/context/NotificationContext";
import { ErrorHandler } from "../../lib/customError";
import Comment from "./comments/Comment";
import UserPostInfo from "./extra/User/User";
import EditableTextArea from "../EditableTextArea/EditableTextArea";

const defaultPayload: PostReaction[] = [
  {
    name: "love",
    count: 0,
    isActive: false,
  },
  {
    name: "like",
    count: 0,
    isActive: false,
  },
  {
    name: "sad",
    count: 0,
    isActive: false,
  },
  {
    name: "wow",
    count: 0,
    isActive: false,
  },
  {
    name: "wrr",
    count: 0,
    isActive: false,
  },
];

export default function Post({
  authorName,
  visibility,
  createdAt,
  content,
  reactions,
  activeReaction,
  id,
}: PostComponent) {
  const post = useRef<number>(id);
  const { request } = useAPI();
  const [activeReactionName, setActiveReactionName] = useState<
    ReactionUnion | undefined
  >(undefined);
  const postContent = useRef<HTMLDivElement>(null);
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const [defaultReactions, setDefaultReactions] =
    useState<PostReaction[]>(defaultPayload);

  useEffect(() => {
    setDefaultReactions((prev) => {
      return prev.map<PostReaction>((key) => {
        return {
          name: key.name,
          count: reactions[key.name] ?? key.count,
          isActive: key.isActive,
        };
      });
    });
    setActiveReactionName(activeReaction as ReactionUnion);
  }, []);

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
        console.log(result.success);
        setActiveReactionName(name);
        setDefaultReactions((prev) =>
          prev.map<PostReaction>((v, i) => {
            return {
              name: v.name,
              count: v.name === name ? v.count + 1 : v.count,
              isActive: v.isActive,
            };
          }),
        );
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
        setDefaultReactions((prev) =>
          prev.map<PostReaction>((v, i) => {
            return {
              name: v.name,
              count: v.name === name ? v.count - 1 : v.count,
              isActive: v.isActive,
            };
          }),
        );
      }
      return result?.success;
    } catch (error) {
      handleServerError(error);
    }
  }

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

  async function handleAddCommentToPost() {
    const result = await request<boolean>('/api/postComments', 'POST', {
      content:comment
    })
  }
  return (
    <div className={isExpanded ? style.expandedContainer : style.container}>
      <UserPostInfo
        avatar={null}
        visibility={visibility}
        authorName={authorName}
        createdAt={createdAt}
      />
      <div
        className={
          isExpanded ? style.expandedContentContainer : style.contentContainer
        }
      >
        <div
          className={isExpanded ? style.expandedContent : style.content}
          ref={postContent}
        >
          <span>{content}</span>
        </div>
        {postContent.current &&
        !isExpanded &&
        postContent.current.scrollHeight > postContent.current.clientHeight ? (
          <div>
            <span
              style={{
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1.3rem",
                opacity: "0.7",
              }}
              onClick={() => setExpanded(true)}
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
          <postReactionContext.Provider value={{ addReaction }}>
            {defaultReactions.map((v, i) => {
              return (
                <Reaction
                  key={v.name + i}
                  name={v.name}
                  isActive={v.name === activeReactionName}
                  count={v.count}
                  onReactionAdd={(name) => addReaction(name as ReactionUnion)}
                />
              );
            })}
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
      {isExpanded && (
        <div className={style.expandedComments}>
          <div className={style.expandedCommentCreator}>
            <EditableTextArea
              additionalStyle={{
                height: "auto",
                fontSize: "1.5rem",
                width: "36vw",
              }}
              placeholder="+ Add your comment"
              placeholderFontSize="1.4rem"
              onInput={(text)=>setComment(text)}
            />
            <div className={style.expandedCommentBar}>
              <Button
                text="Dodaj"
                isDisabled={comment.length === 0 || comment.length > 200 ? true : false}
                additionalStyle={{
                  minWidth: "3.8vw",
                  aspectRatio: "3/1",
                  padding: "0.4%",
                  fontWeight: "600",
                  background: "#b4d4e0",
                  borderRadius: "10px",
                  border: "none",
                  fontSize: "16px",
                  boxShadow: "0px 2px 5px #2222223d",
                }}
              />
              <span style={{color:comment.length > 200 ? 'red' : 'black', fontWeight:comment.length > 200 ? '600' : '400'}}>{comment.length}/200</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
