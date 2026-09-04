import type { NextFunction, Response, Request } from 'express';
import type { IAccountInsertDTO, IUser } from '../Account/types.js';

export interface IAuthService {
  signUp(document: IAccountInsertDTO): Promise<boolean | null>;

  signIn(document: ILogin): Promise<IUser | null>;
  signNewToken(userId: number, tokenType: 'access' | 'refresh'): string;
  isAuthorized(id: number): Promise<IUserAuthorizationPassport | null>;
}
export interface IAuthController {
  createUser(req: Request, res: Response, next: NextFunction): Promise<boolean>;
  signIn(req: Request, res: Response, next: NextFunction): Promise<boolean>;
  isAuthorized(req: Request, res: Response, next: NextFunction):Promise<boolean>
}
export interface ILogin {
  email: string;
  password: string;
}

export interface IUserAuthorizationPassport {
  username: string;
  email: string;
  birthDate: string;
  joinedAt: string;
  id: number;
}
