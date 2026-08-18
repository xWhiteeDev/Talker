import style from "./User.module.css";
import unk_person from '../../../../../assets/unk_person.png'

interface UserPostInfoProps {
    avatar: string | null;
    authorName: string;
    visibility: string;
    createdAt: string;
}

export default function UserPostInfo(user: UserPostInfoProps) {
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
        <span>{user.createdAt}</span>
      </div>
    </div>
  );
}
