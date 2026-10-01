import type { ReactNode } from 'react';
import type { TButtonType, TTextAlign } from '../../interfaces/Unions';
import style from './Button.module.css';
interface IButtonProps {
  width: string;
  height: string;
  backgroundColor: string;
  icon?: string;
  submitFor?: string;
  text?: string | ReactNode;
  type?: TButtonType;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  padding?: string;
  textAlign?: TTextAlign;
  form?: string;
}

function Button(props: IButtonProps) {
  return (
    <div className={style.ButtonContainer} style={{ width: props.width, height: props.height }}>
      {props.icon && <div className={style.IconContainer}>ICO</div>}
      <button
        form={props.form}
        style={{ textAlign: props.textAlign, backgroundColor: props.backgroundColor, color: props.color }}
        type={props.type}
      >
        {props.text}
      </button>
    </div>
  );
}
export default Button;
