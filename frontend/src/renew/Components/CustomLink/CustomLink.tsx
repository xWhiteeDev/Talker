import style from './CustomLink.module.css';
interface ICustomLinkProps {
  text: string;
}
function CustomLink(props: ICustomLinkProps) {
  return <div className={style.LinkContainer}>{props.text}</div>;
}
export default CustomLink;
