import type React from 'react';
import style from './Bar.module.css';
import type { CSSProperties } from 'react';

interface IBarProps {
  backgroundColor: string;
  width: string;
  height: string;
  children?: React.ReactNode;
  isFlexible?: boolean;
  justifyContent?: CSSProperties['justifyContent'];
  alignItems?: CSSProperties['alignItems'];
  direction?: CSSProperties['flexDirection'];
  gap?: string;
}
export default function Bar(props: IBarProps) {
  return (
    <div
      className={style.container}
      style={{
        backgroundColor: props.backgroundColor,
        display: props.isFlexible ? 'flex' : '',
        justifyContent: props.justifyContent,
        alignItems: props.alignItems,
        flexDirection: props.direction,
        width: props.width,
        height: props.height,
        gap:props.gap
      }}
    >
      {props.children}
    </div>
  );
}
