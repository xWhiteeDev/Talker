export interface CustomNotification {
    type: CustomNotificationType;
    message: string;
}

export interface CustomNotificationContext {
    setNotify: (notiContext: CustomNotification) => void;
}

type CustomNotificationType = 'success' | 'error' | 'info';