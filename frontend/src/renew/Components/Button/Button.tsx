import type { ReactNode } from 'react';
import type { TButtonType, TFlexPosition, TTextAlign } from '../../Interfaces/Unions';
import style from './Button.module.css';
import type { IconName } from '../Icon';
import { Icon } from '../Icon/Icon';
import FlexContainer from '../FlexContainer/FlexContainer';
interface IButtonProps {
  width: string;
  height: string;
  backgroundColor: string;
  submitFor?: string;
  text?: string | ReactNode;
  type?: TButtonType;
  color?: string;
  fontSize?: string;
  border?: string;
  fontWeight?: string;
  padding?: string;
  textAlign?: TTextAlign;
  form?: string;
  icon?: IconName;
  iconWidth?: string;
  iconHeight?: string;
  iconAspectRatio?: string;
  itemsAlignPosition?: TFlexPosition;
  itemsJustifyPosition?: TFlexPosition;
  gap?:string
  disabled?: boolean;
  onClick?: () => void;
}

function Button(props: IButtonProps) {
  return (
    <button
      type={props.type ?? 'button'}
      form={props.form}
      disabled={props.disabled}
      onClick={props.onClick}
      className={style.ButtonContainer}
      style={{
        width: props.width,
        height: props.height,
        border: props.border ?? 'none',
        backgroundColor: props.backgroundColor,
        justifyContent: props.itemsJustifyPosition,
        alignItems: props.itemsAlignPosition,
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.5 : 1,
        textAlign: props.textAlign,
        fontSize: props.fontSize,
        color: props.color,
        fontWeight: props.fontWeight,
        padding: props.padding,
        gap:props.gap
        
      }}
    >
      {props.icon && (
        <Icon name={props.icon} height={props.iconHeight} width={props.iconWidth} aspectRatio={props.iconAspectRatio} />
      )}
      {props.text}
    </button>
  );
}
export default Button;
