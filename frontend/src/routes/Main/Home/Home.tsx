import { useContext, useEffect, useState } from "react";
import style from "./Home.module.css";
import Logo from "../../../components/Logo/Logo";
import Input from "../../../components/Input/Input";
import { PostCreator } from "../../../components/PostCreator/PostCreator";
import Button from "../../../components/Button/Button";
import { useAPI } from "../../../hooks/useAPI";
import { NotificationContext } from "../../../components/Notification/context/NotificationContext";
import { usePosts } from "../../../hooks/usePosts";
import Post from "../../../components/Post/Post";

export default function Home() {
  const [focusedInput, setInputFocused] = useState<boolean>(false);
  const [postText, setPostText] = useState<string | undefined>(undefined);
  const [visibility, setVisibility] = useState<string | undefined>(undefined);
  const { request } = useAPI();
  const { refresh, posts } = usePosts();
  useEffect(() => {
    refresh(); //todo
  }, []);
  const ctx = useContext(NotificationContext);
  async function pushPost() {
    if (!visibility || visibility.trim() === "") {
      ctx?.setNotify({ type: "error", message: "Select visibility!" });
      return false;
    }
    if (!postText || postText.trim() === "" || postText.length < 4) {
      ctx?.setNotify({ type: "error", message: "Write more text!" });
      return false;
    }
    const payload = {
      visibleFor: visibility,
      content: postText,
    };
    try {
      const res = await request<boolean>("/api/posts", "POST", payload);
      if (res?.success) {
        ctx?.setNotify({ type: "success", message: "Post added!" });
        refresh();
      } else {
        throw new Error("Post cannot be added");
      }
    } catch (error) {
      if (error instanceof Error) {
        ctx?.setNotify({ type: "error", message: error.message });
      } else {
        ctx?.setNotify({ type: "error", message: "Unknown error!" });
      }
    }
    setInputFocused(false);
  }

  return (
    <>
      <div className={style.optionsContainer}></div>
      <div className={style.searchbarContainer}></div>

      <div className={style.serviceLogoContainer}>
        <Logo additionalStyle={{ width: "5%" }} />
      </div>
      <div className={style.profileContainer}></div>
      <div className={style.accountOptions}></div>
      <div className={style.feedContainer}>
        <div className={style.addPostContainer}>
          {!focusedInput && (
            <div className={style.addPost}>
              <Button
                text="+"
                additionalStyle={{
                  marginLeft: "2%",
                  border: "none",
                  fontSize: "2rem",
                  width: "11%",
                  textAlign: "center",
                  aspectRatio: "1/1",
                  background: "none",
                  color: "#000000",
                }}
              />
              <Input
                placeholderSize="1.2rem"
                onFocus={() => setInputFocused(true)}
                additionalStyle={{
                  background: "none",
                  border: "none",
                  fontSize: "4rem",
                  width: "100%",
                  height: "100%",
                }}
                placeholder="Share something with whole world!"
              />
            </div>
          )}
        </div>
        {focusedInput && (
          <PostCreator
            stateControllerFuction={setInputFocused}
            onInput={(e) => {
              setPostText(e);
            }}
            onVisibilityChange={(v) => {
              setVisibility(v);
            }}
            onAdd={async () => await pushPost()}
          />
        )}

        {!focusedInput &&
          posts?.map((v) => {
            return (
              <Post
                key={v.id}
                avatar={null} //todo
                authorName={v.firstName + " " + v.lastName}
                content={v.content}
                visibility={v.visiblefor}
                createdAt={v.created_at}
                reactions={v.reactions_object ?? {}}
                activeReaction = {v.myReaction}
                id={v.id}
              />
            );
          })}
      </div>
    </>
  );
}
