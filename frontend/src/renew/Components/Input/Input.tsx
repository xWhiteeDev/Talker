import type { TInputType } from '../../interfaces/Unions';
import type {IconName} from '../Icon';
import {Icon} from '../Icon/Icon';
import style from './Input.module.css';
interface IInputProps {
  icon?: IconName;
  iconWidth?:string;
  iconHeight?:string;
  iconAspectRatio?:string
  text?: string;
  placeholder?: string;
  fontSize?: string;
  fontWeight?: string;
  type?: TInputType;
  min?: number;
  max?: number;
  height: string;
  width: string;
}

function Input(props: IInputProps) {
  return (
    <div className={style.InputContainer} style={{ height: props.height, width: props.width }}>
      {props.icon && <Icon name={props.icon} height={props.iconHeight} width={props.iconWidth} aspectRatio={props.iconAspectRatio}/>}
      <input
        minLength={props.min}
        maxLength={props.max}
        placeholder={props.placeholder}
        style={{ fontWeight: props.fontWeight, fontSize: props.fontSize, width: '100%' }}
        type={props.type}
        name=""
        id=""
      />
    </div>
  );
}
export default Input;
