import style from './Friend.module.css';

interface IBasicFriendInfoProps {
  name: string;
  avatar: string | null;
  onClick:()=>void
}

export default function Friend({ name, avatar, onClick }: IBasicFriendInfoProps) {
  return (
    <div className={style.container} onClick={onClick}>
      <div className={style.avatar} style={{ backgroundImage: `url(${avatar ?? `https://ui-avatars.com/api/?name=${name.split(' ').join('+')}`})` }}></div>
      <div className={style.name}><strong>{name}</strong></div>
    </div>
  );
}
