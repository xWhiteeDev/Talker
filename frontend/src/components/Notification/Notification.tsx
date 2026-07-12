import { useEffect, useState } from "react";
import style from "./notify.module.css";
import type { Notification } from "./types";
import { fetchImage } from "../../lib/fetchImage";

const fileImagesByType: Record<string, string> = {
  error: "error.png",
  success: "success.png",
  info: "info.png",
};

export default function CustomNotification({ type, message }: Notification) {
  const [img, setImage] = useState<string | undefined>(undefined);
  useEffect(() => {
    fetchImage(fileImagesByType[type]).then((source) => setImage(source));
  }, [img]);
  return (
    <div className={style.container}>
      <div className={style.type}>{img && <img src={img} alt="" />}</div>
      <div className={style.context}>
        <span>
          {message}
        </span>
      </div>
    </div>
  );
}
