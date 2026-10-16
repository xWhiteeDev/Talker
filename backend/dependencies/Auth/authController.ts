import type {NextFunction, Request, Response} from 'express';
import {configDotenv} from 'dotenv';
import {ErrorHandler} from '../../handlers/errorHandler.js';
import type {IAuthController, IAuthService, ILogin, IServerAccountRegisterData} from './types.js';
import type {ICurrentUser} from '../Account/types.js';
import {ACCESS_TOKEN, REFRESH_TOKEN} from './cfg/cookie.js';

configDotenv();
export class AuthController implements IAuthController {
  constructor(private authService: IAuthService) {
  }
  async createUser(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    try {
      const registerPackage: IServerAccountRegisterData = req.body;
      await this.authService.signUp(registerPackage);
      res.status(200).json({success: true, message: 'Account created!'});
      return true;
    } catch (error) {
      next(error);
      return false;
    }
  }
  async signIn(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    try {
      const data: ILogin = req.body;
      const signResult = await this.authService.signIn({
        email: data.email,
        password: data.password,
      });
      if (!signResult) {
        throw new ErrorHandler('Failed to sign in', 400, false);
      }
      res.cookie('accessToken', signResult.accessToken, ACCESS_TOKEN);
      res.cookie('refreshToken', signResult.refreshToken, REFRESH_TOKEN);
      res.status(200).json({success: true, data: {verified: signResult.account.status, welcomeSeen: signResult.account.welcomeSeen, firstName: signResult.account.firstName, lastName: signResult.account.lastName}, message: 'Logged in!'});
      return true;
    } catch (error) {
      next(error);
      return false;
    }
  }
  createNewToken(req: Request, res: Response, next: NextFunction) {
    if (!req.currentUser) {
      next(new ErrorHandler('Unauthorized', 401, true));
      return false;
    }
    const payload: ICurrentUser = req.currentUser;
    const signedToken = this.authService.signNewToken(payload.id, 'access');
    res.cookie('accessToken', signedToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 5 * 60 * 1000,
    });
    res.status(200).json({success: true, data: payload.id});
    return true;
  }
  async isAuthorized(req: Request, res: Response, next: NextFunction): Promise<boolean> {

    try {
      if (!req.currentUser) {
        throw new ErrorHandler('Unauthorized', 401, true);
      }
      const userId: number | null = await this.authService.isAuthorized(req.currentUser.id);
      if (userId == null) {
        throw new ErrorHandler('User is not authorized', 401);
      }
      const payload: ICurrentUser = {id: userId};
      req.currentUser = payload;
      res.status(200).json({success: true, data: payload});
      return true;
    } catch (error) {
      next(error);
      return false;
    }
  }
  async isEmailTaken(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.query['email'];
      if (typeof email !== 'string') {
        res.status(400).json({success: false, message: 'Email was expected as string!'});
        return false;
      }
      const result = await this.authService.isEmailTaken(email);
      res.status(result ? 200 : 400).json({success: result});
      return result;
    } catch (error) {
      next(error);

      return false;
    }
  }

}
