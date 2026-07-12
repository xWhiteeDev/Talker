export interface Notification {
    type: NotificationType
    message: string
}

type NotificationType = 'success' | 'error' | 'warn' | 'info'