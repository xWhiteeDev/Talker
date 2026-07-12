import { useEffect, useState } from "react";
import style from "./fileOption.module.css";
import type { FileOption } from "./types";
import { fetchImage } from "../../lib/fetchImage";

const cachedIcons: Map<string, string> = new Map();

export default function FileOption({
  fileIcon,
  text,
  onClick,
  additionalStyle
}: FileOption) {
  const [fileImage, setFileImage] = useState<string>();

  const getIconString = async (fileIcon: string) => {
    const iconString = await fetchImage(fileIcon);
    return iconString;
  };

  useEffect(() => {
    const cachedIcon = cachedIcons.get(fileIcon);
    if (cachedIcon) {
      setFileImage(cachedIcon);
      return;
    }
    (async () => {
      const iconString: string | undefined = await getIconString(fileIcon);
      if (!iconString) return;
      setFileImage(iconString);
      cachedIcons.set(fileIcon, iconString);
    })();
  }, [fileIcon]);

  return (
    <div
      className={style.fileoption}
      style={{ background: "none" }}
      onClick={onClick}
    >
      <div
        style={{
          backgroundImage: `url(${fileImage})`,
          width: "20%",
          height: "100%",
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          // backgroundColor:"red"
        }}
      ></div>
      <div
        style={{
          background: "none",
          width: "40%",
          textAlign: "center",
          ...additionalStyle
        }}
      >
        <span>{text}</span>
      </div>
    </div>
  );
}
