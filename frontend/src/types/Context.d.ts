export interface CustomNotification {
    type:string;
    message:string
}

export interface CustomNotificationContext {
    setNotify: (notiContext: CustomNotification) => void;
}

export interface PostReactionContext {
    addReaction(name:string): Promise<unknown>;
}