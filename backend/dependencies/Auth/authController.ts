import type { NextFunction, Request, Response } from 'express';
import { configDotenv } from 'dotenv';
import { ErrorHandler } from '../../handlers/errorHandler.js';
import type { IAuthController, IAuthService, ILogin, IUserAuthorizationPassport, IUserRegisterPayload } from './types.js';
import type { currentUser, IUser } from '../Account/types.js';

configDotenv();
export class AuthController implements IAuthController {
  constructor(private authService: IAuthService) {
    console.log(`\x1b[32;1m🚀[authController] AccountService injected \x1b[0m`);
  }
  async createUser(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    try {
      const userPayload: IUserRegisterPayload | undefined = req.body.data;
      if (
        !userPayload ||
        !userPayload.password ||
        !userPayload.email ||
        !userPayload.birthdayDate ||
        !userPayload.firstName ||
        !userPayload.lastName
      ) {
        throw new ErrorHandler('Failed to create account', 400, false);
      }
      const result = await this.authService.signUp(req.body.data);
      if (!result) {
        throw new ErrorHandler('Failed to create account', 400, false);
      }
      res.status(200).json({ success: true, data: result });
      return true;
    } catch (error) {
      next(error);
    }
    return true;
  }
  async signIn(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    try {
      const data: ILogin | undefined = req.body.data;
      if (!data || !data.email || !data.password) {
        throw new ErrorHandler('Failed to sign in', 400, true);
      }
      const signResult = await this.authService.signIn({
        email: data.email,
        password: data.password,
      });
      if (!signResult) {
        throw new ErrorHandler('Failed to sign in', 400, false);
      }
      res.cookie('accessToken', signResult.access, {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 5 * 60 * 1000,
      });
      res.cookie('refreshToken', signResult.refresh, {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 60000 * 60 * 24 * 7,
      });
      if (!req.currentUser) {
        req.currentUser = {} as currentUser;
      }
      const currentUserPayload: IUserAuthorizationPassport = {
        username: signResult.username,
        email: signResult.email,
        birthDate: signResult.birthDate,
        joinedAt: signResult.joinedAt,
        id: signResult.id,
      };
      req['currentUser'] = currentUserPayload;
      res.status(200).json({ success: true, data: currentUserPayload });
      return true;
    } catch (error) {
      next(error);
    }
    return true;
  }
  createNewToken(req: Request, res: Response, next: NextFunction) {
    if (!req.currentUser) {
      next(new ErrorHandler('Unauthorized', 401, true));
      return false;
    }
    const { id } = req.currentUser;
    const signedToken = this.authService.signNewToken(id, 'access');
    res.cookie('accessToken', signedToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 5 * 60 * 1000,
    });
    res.status(200).json({ success: true, data: { id } });
    return true;
  }
  async isAuthorized(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    try {
      if (!req.currentUser) {
        throw new ErrorHandler('Unauthorized', 401, true);
      }
      const user = await this.authService.isAuthorized(+req.currentUser.id);
      if (!user) {
       throw new ErrorHandler('User not exist', 400);
      }
      const currentUserPayload = {
        username: user.username,
        email: user.email,
        birthDate: user.birthDate,
        joinedAt: user.joinedAt,
        id: user.id,
      };
      req['currentUser'] = currentUserPayload;
      res.status(200).json({ success: true, data: currentUserPayload });
      return true;
    } catch (error) {
      next(error);
      return false;
    }
  }
}
