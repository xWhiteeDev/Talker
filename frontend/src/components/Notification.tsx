import { useEffect, useState } from "react";
import type { INotification } from "../interfaces/components/INotification";
import { fetchImage } from "../services/root";
import style from "../styles/components/notify.module.css";

const fileImagesByType: Record<string, string> = {
  error: "error.png",
  success: "success.png",
  info: "info.png",
};

export default function CustomNotification({ type, message }: INotification) {
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
