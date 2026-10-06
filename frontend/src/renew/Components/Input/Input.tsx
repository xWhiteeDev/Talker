import type {HTMLInputAutoCompleteAttribute} from 'react';
import type { TInputMode, TInputType } from '../../Interfaces/Unions';
import type { IconName } from '../Icon';
import { Icon } from '../Icon/Icon';
import style from './Input.module.css';
interface IInputProps {
  icon?: IconName;
  iconWidth?: string;
  iconHeight?: string;
  iconAspectRatio?: string;
  placeholder?: string;
  fontSize?: string;
  fontWeight?: string;
  type?: TInputType;
  min?: number;
  minLength?:number;
  maxLength?:number
  minDate?: string;
  required?: boolean;
  max?: number;
  onInput?(value: string): void;
  value: string;
  height: string;
  width: string;
  border?:string
  inputMode?:TInputMode;
  autoComplete?:HTMLInputAutoCompleteAttribute
}

function Input(props: IInputProps) {
  return (
    <div className={style.InputContainer} style={{height: props.height, width: props.width ,border:props.border}}>
      {props.icon && (
        <Icon name={props.icon} height={props.iconHeight} width={props.iconWidth} aspectRatio={props.iconAspectRatio} />
      )}
      <input
        inputMode={props.inputMode}
        autoComplete={props.autoComplete}
        value={props.value}
        min={props.min}
        max={props.max}
        minLength={props.minLength}
        maxLength={props.maxLength}
        placeholder={props.placeholder}
        required={props.required}
        style={{ fontWeight: props.fontWeight, fontSize: props.fontSize, width: '100%' }}
        type={props.type}
        name=""
        id=""
        onInput={(ev) => {
          if (props.onInput) props.onInput(ev.currentTarget.value);
        }}
      />
    </div>
  );
}
export default Input;
