import style from "./PostCreator.module.css";
import Button from "../Button/Button";
import EditableTextArea from "../EditableTextArea/EditableTextArea";
import FileOption from "../FileOption/FileOption";
import OptionList from "../OptionList/OptionList";
import type { PostCreator } from "./types";

const postClickableOptions = [
  {
    fileIcon: "photo_ico.png",
    text: "Add photo",
    key: 0,
  },
  {
    fileIcon: "video_ico.png",
    text: "Add video",
    key: 1,
  },
  {
    fileIcon: "file_ico.png",
    text: "Attach file",
    key: 2,
  },
  {
    fileIcon: "place_ico.png",
    text: "Pin place",
    key: 3,
  },
  {
    fileIcon: "friends_ico.png",
    text: "Tag friend",
    key: 4,
  },
  {
    fileIcon: "gif_ico.png",
    text: "Add gif",
    key: 5,
  },
];

export function PostCreator({
  stateControllerFuction,
  onInput,
  onAdd,
  onVisibilityChange,
}: PostCreator) {
  return (
    <div className={style.postCreator}>
      <div className={style.closeXCreator}>
        <Button
          text="X"
          onClick={() => stateControllerFuction(false)}
          additionalStyle={{
            position: "absolute",
            right: "0",
            background: "none",
            border: "none",
            fontWeight: "600",
            width: "2vw",
            fontSize: "1.4rem",
            textAlign: "center",
            aspectRatio: "1/1",
          }}
        />
      </div>
      <div className={style.header}>
        <span>Create post</span>
      </div>
      <div className={style.options}>
        <OptionList
          onOptionChange={(v) => {
            if (!onVisibilityChange) return
            onVisibilityChange(v);
          }}
          placeholderText="Who will see it?"
          additionalStyle={{
            backgroundColor: "#524c4c00",
            marginLeft: "2%",
            width: "45%",
            fontSize: "0.8rem",
            height: "75%",
          }}
        />
      </div>
      <div className={style.inputArea}>
        <EditableTextArea
          placeholderColor="#1a191991"
          placeholderFontSize="1.5rem"
          placeholder="What's happening..."
          additionalStyle={{
            width: "100%",
            fontSize: "1.4rem",
            maxWidth: "100%",
          }}
          onInput={(e) => onInput(e)}
        />
      </div>
      <div className={style.fileOptions}>
        {postClickableOptions.map((v) => (
          <FileOption
            fileIcon={v.fileIcon}
            key={v.key}
            text={v.text}
            additionalStyle={{ fontSize: "1.2rem" }}
          />
        ))}
      </div>
      <Button
        text="+"
        additionalStyle={{
          width: "6.5%",
          fontSize: "2.4rem",
          aspectRatio: "1/1",
          border: "none",
          backgroundColor: "#ff000000",
        }}
        onClick={(ev) => onAdd()}
      />
    </div>
  );
}
