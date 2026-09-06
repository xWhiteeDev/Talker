import type { IBasicUserInfo } from '../components/IUser';

export interface ICustomNotification {
  type: string;
  message: string;
}

export interface ICustomNotificationContext {
  setNotify: (notiContext: ICustomNotification) => void;
}

export interface IAuthContext {
  login(userData: IBasicUserInfo): boolean;
  logout(): boolean;
  user: IBasicUserInfo | undefined;
  loggedIn: boolean;
}
