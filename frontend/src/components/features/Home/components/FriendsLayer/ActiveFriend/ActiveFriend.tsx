import style from './ActiveFriend.module.css';

interface ActiveFriendsProps {
  name: string;
  id: number;
  lastTimeActive?: string;
}

export default function ActiveFriend({ name }: ActiveFriendsProps) {
  return (
    <div className={style.container}>
      <div className={style.user}>
        <div className={style.avatar}></div>
        <div className={style.username}>{name}</div>
        <div className={style.active}></div>
      </div>
    </div>
  );
}
