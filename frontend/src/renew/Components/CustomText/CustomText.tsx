import type React from 'react';
import type { TTextAlign } from '../../Interfaces/Unions';

interface ICustomTextProps {
  text: React.ReactNode | string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  textShadow?: string;
  textAlign?: TTextAlign;
  className?: string;
  bottomBorder?: string;
  padding?: string;
  position?: React.CSSProperties['position'];
  top?:string;
  left?:string;
  pointerEvents?:React.CSSProperties['pointerEvents']
}

function CustomText(props: ICustomTextProps) {
  return (
    <span
      style={{
        color: props.color,
        textAlign: props.textAlign,
        fontSize: props.fontSize ?? '1rem',
        fontWeight: props.fontWeight ?? '500',
        textShadow: props.textShadow,
        borderBottom: props.bottomBorder,
        padding: props.padding,
        position:props.position,
        top:props.top,
        left:props.left,
        pointerEvents:props.pointerEvents
      }}
      className={props.className}
    >
      {props.text}
    </span>
  );
}
export default CustomText;
