import style from './Button.module.css';
import { Icon } from '../Icon/Icon';
import type { IButtonProps } from './types';

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
        boxShadow: props.withoutShadow ? 'none' : '6px 4px 6px 2px rgba(0, 0, 0, 0.541)',
        color: props.color,
        fontWeight: props.fontWeight,
        padding: props.padding,
        gap: props.gap,
        borderRadius: props.borderRadius,
        aspectRatio: props.aspectRatio,
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
