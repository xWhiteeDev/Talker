import style from "./Comment.module.css";
import unk_person from '../../../assets/unk_person.png';
import type { Comments } from "./types";

export default function Comment({
  authorName,
  avatar,
  content,
  createdAt,
}: Comments) {
  return (
    <div className={style.container}>
      <div className={style.author}>
        <div className={style.userAvatar}>
          <img
            src={avatar ?? unk_person}
            className={style.avatar}
            alt="user avatar"
          />
        </div>
        <div className={style.postInfo}>
          <span style={{ fontWeight: "600", cursor: "pointer" }}>
            {authorName}
          </span>
          <span>{new Date(createdAt).toLocaleString()}</span>
        </div>
      </div>
      <div className={style.content}>{content}</div>
    </div>
  );
}
