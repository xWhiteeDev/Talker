type TNotificationType = 'success' | 'warn' | 'failed';
export interface INotification {
    type: TNotificationType;
    message: string;
}