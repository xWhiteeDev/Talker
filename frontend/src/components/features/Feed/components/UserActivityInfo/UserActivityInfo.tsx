import style from './UserActivityInfo.module.css';
import unk_person from '../../../../../assets/unk_person.png';

interface UserActivityInfoProps {
  avatar: string | null;
  authorName: string;
  createdAt: string;
  onClick?:() => void
  visibility?: string;
}

export default function UserActivityInfo({ avatar, authorName, createdAt, visibility, onClick }: UserActivityInfoProps) {
  return (
    <div className={style.user}>
      <div className={style.userAvatar}>
        <img src={avatar ?? unk_person} className={style.avatar} alt="user avatar" onClick={onClick} />
      </div>
      <div className={style.postInfo}>
        <span style={{ fontWeight: '600' }}>{authorName}</span>
        {visibility && <span>{visibility}</span>}
        <span>{createdAt}</span>
      </div>
    </div>
  );
}
