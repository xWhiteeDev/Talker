import style from './UserAvatar.module.css';
type TAvatarShape = 'rounded' | 'circle' | 'box';
interface IUserAvatarProps {
  avatarUrl: string;
  type?: TAvatarShape;
  margin?: string;
  width?: string;
  height?: string;
  aspectRatio?: string;
  border?:string;
  isRounded?:boolean
}

export default function UserAvatar(props: IUserAvatarProps) {
  return <img className={style.container} style={{ ...props, borderRadius:props.isRounded ? '50%': '0%' }} src={props.avatarUrl} alt={'User avatar'} />;
}
