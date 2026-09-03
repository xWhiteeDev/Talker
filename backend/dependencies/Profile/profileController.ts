import type { Request, Response, NextFunction } from 'express';
import type {  IProfileController, IProfileService } from './types.js';
import type { IUser } from '../Account/types.js';
import { ErrorHandler } from '../../handlers/errorHandler.js';

class ProfileController implements IProfileController {
  constructor(private profileService: IProfileService) {}
  async getUser(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    try {
      const user: IUser = req.currentUser;
      const requestedId = +req.params['id']
      if (!user) {
        next(new ErrorHandler('Failed to get user property.', 400));
        return false;
      }
      const profileData = await this.profileService.get(user.id,requestedId);
      res.status(200).json({ success: true, data: profileData });
      return true;
    } catch (error) {
      next(error);
      return false;
    }
  }
   async getMe(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    try {
      const user: IUser = req.currentUser;

      if (!user) {
        next(new ErrorHandler('Failed to get user property.', 400));
        return false;
      }
      const profileData = await this.profileService.get(user.id,user.id);
      res.status(200).json({ success: true, data: profileData });
      return true;
    } catch (error) {
      next(error);
      return false;
    }
  }
}

export { ProfileController };
