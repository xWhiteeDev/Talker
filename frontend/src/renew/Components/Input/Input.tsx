import type { HTMLInputAutoCompleteAttribute } from 'react';
import type { TInputMode, TInputType } from '../../Interfaces/Unions';
import type { IconName } from '../Icon';
import { Icon } from '../Icon/Icon';
import style from './Input.module.css';
interface IInputProps {
  onInput?(value: string): void;
  value: string | undefined;
  height: string;
  width: string;
  border?: string;
  max?: number;
  icon?: IconName;
  iconWidth?: string;
  iconHeight?: string;
  iconAspectRatio?: string;
  placeholder?: string;
  fontSize?: string;
  fontWeight?: string;
  type?: TInputType;
  min?: number;
  minLength?: number;
  maxLength?: number;
  minDate?: string;
  required?: boolean;
  inputMode?: TInputMode;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  backgroundColor?: string;
  borderRadius?: string;
  onConfirm?(value: string): void;
}

function Input(props: IInputProps) {
  return (
    <div
      className={style.InputContainer}
      style={{
        height: props.height,
        borderRadius: props.borderRadius,
        width: props.width,
        border: props.border,
        backgroundColor: props.backgroundColor,
      }}
    >
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
        style={{ fontWeight: props.fontWeight, fontSize: props.fontSize, width: '100%', backgroundColor: props.backgroundColor }}
        type={props.type}
        name="input"
        id=""
        onInput={(ev) => {
          if (props.onInput) props.onInput(ev.currentTarget.value);
        }}
        onKeyDown={(key) => {
          if (key.key === 'Enter') {
            props.onConfirm && props.value && props.value.trim().length !== 0 && props.onConfirm(props.value);
          }
        }}
      />
    </div>
  );
}
export default Input;
