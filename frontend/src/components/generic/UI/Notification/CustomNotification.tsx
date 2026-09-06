import { useEffect, useState } from 'react';
import style from './CustomNotification.module.css';
import type { TNotificationType } from '../../../../types/components/IComponentsUnion';
import { fetchImage } from '../../../../services/fetchImageService';

interface CustomNotificationProps {
  type: TNotificationType;
  message: string;
}

const fileImagesByType: Record<string, string> = {
  error: 'error.png',
  success: 'success.png',
  info: 'info.png',
};

export default function CustomNotification({ type, message }: CustomNotificationProps) {
  const [img, setImage] = useState<string | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const source = await fetchImage(fileImagesByType[type]);
      setImage(source);
    })();
  }, [type]);
  return (
    <div className={style.container}>
      <div className={style.type}>{img && <img src={img} alt="" />}</div>
      <div className={style.context}>
        <span>{message}</span>
      </div>
    </div>
  );
}
