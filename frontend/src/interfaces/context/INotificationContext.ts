export interface INotification {
    type: NotificationType;
    message: string;
}

export interface INotificationContext {
    setNotify: (notiContext: INotification) => void;
}

type NotificationType = 'success' | 'error' | 'info';