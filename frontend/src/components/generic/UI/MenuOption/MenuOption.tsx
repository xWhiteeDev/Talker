import { useEffect, useState } from 'react';
import style from './MenuOption.module.css';
import { fetchImage } from '../../../../services/fetchImageService';
import { ErrorHandler } from '../../../../lib/customError';
import useNotify from '../../../../hooks/useNotify';
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
  const { setNotification } = useNotify();
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchImage(`${icon}.svg`);
        if (!res) {
          throw new ErrorHandler('Failed to load icon for MenuOption', 400);
        }
        setIconString(res);
      } catch (err) {
        if (err instanceof ErrorHandler) {
          setNotification('error', err.message);
        } else {
          setNotification('error', 'Unknown error in MenuOption');
        }
      }
    })();
  }, [icon, setNotification]);

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
