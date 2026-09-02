import style from './Tab.module.css';
import type { TabProps } from './types';

export default function Tab({ header, text }: TabProps) {
  return (
    <div className={style.container}>
      <div>
        <span>
          <strong>{header}</strong>
        </span>
      </div>
      <div className={style.content}>
        <span>{text}</span>
      </div>
    </div>
  );
}
