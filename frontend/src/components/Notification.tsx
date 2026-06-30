import type { INotification } from "../interfaces/components/INotification";
import style from "../styles/components/notify.module.css";

export default function CustomNotification({ type, message }: INotification) {
  return (
    <div className={style.container}>
      <div className={style.type}></div>
      <div className={style.context}>{message}</div>
      {type === "error" && <div className={style.code}></div>}
    </div>
  );
}
