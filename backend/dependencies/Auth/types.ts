import type {NextFunction, Response, Request} from 'express';
import type {TAccountStatus, TGender} from '../../types/unions.js';
import type {IPersonal} from '../Personal/types.js';

export interface ILogin {
  email: string;
  password: string;
}
interface IAccount {
  email: string;
  id: number;
  status: TAccountStatus;
  welcomeSeen:boolean
}

export interface IServerPersonalData {
  firstName: string;
  lastName: string;
  livingPlace: string | null;
  gender: TGender;
  birthdayDate: string;
}

export interface IServerAccountData {
  email: string;
  password: string;
  repassword: string;
}

export interface IServerAccountRegisterData {
  personal: IServerPersonalData;
  account: IServerAccountData;
}

export interface IUserAuthorizationPassport {
  personal: IServerPersonalData;
  account: IAccount;
}

export interface ISignInPayload {
  personal: Omit<IPersonal, 'birthdayDate' | 'livingPlace'>;
  account: Pick<IAccount & IServerPersonalData, 'status' | 'firstName' | 'lastName'  | 'welcomeSeen'>;
  refreshToken: string; 
  accessToken: string;
}


export interface IAuthService {
  signUp(document: IServerAccountRegisterData): Promise<boolean | null>;

  signIn(document: ILogin): Promise<ISignInPayload| null>;
  signNewToken(userId: number, tokenType: 'access' | 'refresh'): string;
  isAuthorized(id: number): Promise<number | null>;
  isEmailTaken(email: string): Promise<boolean>;
}
export interface IAuthController {
  createUser(req: Request, res: Response, next: NextFunction): Promise<boolean>;
  signIn(req: Request, res: Response, next: NextFunction): Promise<boolean>;
  isAuthorized(req: Request, res: Response, next: NextFunction): Promise<boolean>;
}


