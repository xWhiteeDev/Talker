import { useContext } from 'react';
import { CustomNotificationCtx } from '../context/customNotificationContext';
import type { NotificationType } from '../types/VisualUnions';

export default function useNotify() {
  const notifyContext = useContext(CustomNotificationCtx);
  function setNotification(type: NotificationType, message: string) {
    if (notifyContext) {
      notifyContext.setNotify({ type, message });
    } else {
      throw new Error('useNotify hook is not in CustomNotificationProvider.');
    }
  }
  return { setNotification };
}
