import type { TInputType } from '../../interfaces/Unions';
import style from './Input.module.css';
interface IInputProps {
  icon?: string;
  text?: string;
  placeholder?: string;
  fontSize?: string;
  type?: TInputType;
  height: string;
  width: string;
}

function Input(props: IInputProps) {
  return (
    <div className={style.InputContainer} style={{ height: props.height, width: props.width }}>
      {props.icon && <div className={style.IconContainer}>ICO</div>}
      <input placeholder={props.placeholder} style={{ fontSize: props.fontSize }} type={props.type} name="" id="" />
    </div>
  );
}
export default Input;
