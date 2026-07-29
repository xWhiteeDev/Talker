import { useContext, useEffect, useState } from "react";
import style from "./Home.module.css";
import Logo from "../../../components/Logo/Logo";
import Button from "../../../components/Button/Button";
import { useAPI } from "../../../hooks/useAPI";
import { NotificationContext } from "../../../components/Notification/context/NotificationContext";
import { usePosts } from "../../../hooks/usePosts";
import Post from "../../../components/Post/Post";
import EditableTextArea from "../../../components/EditableTextArea/EditableTextArea";
import OptionList from "../../../components/OptionList/OptionList";

import photo_ico from "../../../assets/icons/photo_ico.png";
import gif from "../../../assets/icons/gif_ico.png";

export default function Home() {
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
          <div className={style.addPost}>
            {postText && postText.length > 0 ? (
              <OptionList
                placeholderText="Select visibility"
                itemsList={["Public", "Friends", "Private"]}
              />
            ) : null}
            <EditableTextArea
              placeholderColor="black"
              placeholder={"+ Share something with world"}
              placeholderFontWeight="600"
              max={300}
              onInput={(text) => setPostText(text)}
              additionalStyle={{
                padding: "2%",
                width: "29.5vw",
                maxWidth: "100%",
                minHeight: "1vh",
                color: "black",
              }}
            />
            {postText && postText.length > 0 ? (
              <div className={style.postTools}>
                <span style={{ justifySelf: "center", alignSelf: "center" }}>
                  {postText.length} / {300}
                </span>
                <div className={style.attachments}>
                  <img src={photo_ico} width={33} alt="" />
                  <img src={photo_ico} width={33} alt="" />

                  <img src={photo_ico} width={33} alt="" />
                  <img src={photo_ico} width={33} alt="" />
                </div>
                <Button
                  text="Add post"
                  additionalStyle={{
                    width: "80%",
                    justifySelf: "center",
                    alignSelf: "center",
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>

        {posts?.map((v) => {
          return (
            <Post
              key={v.id}
              avatar={null} //todo
              authorName={v.firstName + " " + v.lastName}
              content={v.content}
              visibility={v.visiblefor}
              createdAt={v.created_at}
              reactions={v.reactions_object ?? {}}
              activeReaction={v.myReaction}
              id={v.id}
            />
          );
        })}
      </div>
    </>
  );
}
