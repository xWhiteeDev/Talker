import { useState } from "react";
import style from "./Home.module.css";
import Logo from "../../../components/Logo/Logo";
import Input from "../../../components/Input/Input";
import { PostCreator } from "../../../components/PostCreator/PostCreator";
import Button from "../../../components/Button/Button";
import { useAPI } from "../../../hooks/useAPI";

export default function Home() {
  const [focusedInput, setInputFocused] = useState<boolean>(false);
  const [postText, setPostText] = useState<string | undefined>(undefined);
  const { request } = useAPI();
  async function pushPost() {
    const payload = {
      content: postText,
    };
    await request<boolean>("/api/posts", "POST", payload);
    console.log("Kliknieto dodaj post");
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
              console.log(e);
            }}
            onAdd={async () => await pushPost()}
          />
        )}
      </div>
    </>
  );
}
