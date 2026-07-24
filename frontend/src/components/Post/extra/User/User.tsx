import style from "./User.module.css";
import type { UserPostInfo } from "./types";
import unk_person from '../../../../assets/unk_person.png'
export default function UserPostInfo(user: UserPostInfo) {
  return (
    <div className={style.user}>
      <div className={style.userAvatar}>
        <img src={user.avatar ?? unk_person} className={style.avatar} alt="user avatar" />
      </div>
      <div className={style.postInfo}>
        <span style={{ fontWeight: "600" }}>
          {user.authorName}
        </span>
        <span>{user.visibility}</span>
        <span>{new Date(user.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
}
