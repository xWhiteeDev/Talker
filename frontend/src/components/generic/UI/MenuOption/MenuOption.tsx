import { useEffect, useState } from 'react';
import style from './MenuOption.module.css';
import { fetchImage } from '../../../../services/fetchImageService';
interface MenuOptionProps {
  text: string;
  onClick?: () => void;
  icon?: string;
}

export default function MenuOption({ text, onClick, icon }: MenuOptionProps) {
  const [iconString, setIconString] = useState<string | undefined>(undefined);
  const words = text.split(' ');
  const firstWord = words[0];
  const restWord = words.slice(1).join(' ');
  useEffect(() => {
    if (icon)
      fetchImage(`${icon}.svg`)
        .then((res) => {
          setIconString(res);
        })
        .catch((err) => console.error('Failed to load icon for MenuOption!', icon));
  }, []);

  return (
    <div className={style.container}>
      <div className={style.elements}>
        {icon && <div className={style.icon} style={{ backgroundImage: `url("${iconString}")` }}></div>}
        <span onClick={onClick}>
          <strong>{firstWord}</strong> {restWord}
        </span>
      </div>
    </div>
  );
}
