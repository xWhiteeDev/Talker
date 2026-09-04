import type {IUser} from "./AuthHook";

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

export interface IAuthContext {
    login(userData:IUser):boolean;
    logout():boolean;
    user:IUser | undefined;
    loggedIn:boolean
}