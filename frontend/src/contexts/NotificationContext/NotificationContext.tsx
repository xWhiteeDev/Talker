import { createContext, useState } from 'react';
import type { INotification } from './types';

export const notificationContext = createContext<INotification | null>(null);

export function NotificationProvider({ children }: React.PropsWithChildren) {
  const [message, setMessage] = useState<string>();
  const createNotification = (props: INotification) => {
    
  };
}
