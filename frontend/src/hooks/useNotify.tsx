import { useContext } from 'react';
import { CustomNotificationCtx } from '../context/customNotificationContext';
import type {TNotificationType} from '../types/components/IComponentsUnion';

export default function useNotify() {
  const notifyContext = useContext(CustomNotificationCtx);
  function setNotification(type: TNotificationType, message: string) {
    if (notifyContext) {
      notifyContext.setNotify({ type, message });
    } else {
      throw new Error('useNotify hook is not in CustomNotificationProvider.');
    }
  }
  return { setNotification };
}
