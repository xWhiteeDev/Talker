import type { ReactNode } from 'react';
import type { TButtonType, TFlexPosition, TTextAlign } from '../../interfaces/Unions';
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
  disabled?: boolean;
  onClick?: () => void;
}

function Button(props: IButtonProps) {
  return (
    <div
      onClick={props.disabled ? undefined : props.onClick}
      style={{
        width: props.width,
        backgroundColor: props.backgroundColor,
        height: props.height,
        justifyContent: props.itemsJustifyPosition,
        alignItems: props.itemsAlignPosition,
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.5 : 1,
      }}
      className={style.ButtonContainer}
    >
      {props.icon && (
        <FlexContainer
          width="auto"
          height="100%"
          justifyContent={props.itemsJustifyPosition}
          alignItems={props.itemsAlignPosition}
        >
          <Icon name={props.icon} height={props.iconHeight} width={props.iconWidth} aspectRatio={props.iconAspectRatio} />
        </FlexContainer>
      )}
      <button
        form={props.form}
        style={{
          textAlign: props.textAlign,
          fontSize: props.fontSize,
          color: props.color,
          fontWeight: props.fontWeight,
          background: 'none',
          cursor: props.disabled ? 'not-allowed' : 'pointer'
        }}
        type={props.type}
        disabled={props.disabled}
      >
        {props.text}
      </button>
    </div>
  );
}
export default Button;
