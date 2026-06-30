export interface INotification {
    type: NotificationType
    message: string
}

type NotificationType = 'success' | 'error' | 'warn' | 'info'