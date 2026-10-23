import CustomText from '../CustomText/CustomText';
import type { IWindowProps } from './types';
import style from './Window.module.css';

export default function Window(props: IWindowProps) {
  return (
    <div className={style.container} style={{ ...props, boxShadow:props.withShadow ? '2px 3px 7px #00000033' : '' }}>
      {props.description && <CustomText  text={props.description} fontWeight='300' color='gray' /> }
      {props.children}
    </div>
  );
}
