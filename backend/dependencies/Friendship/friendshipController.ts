import { ErrorHandler } from '../../handlers/errorHandler.js';
import type { currentUser } from '../Account/types.js';
import type { IFriendshipController, IFriendshipService } from './types.js';
import type { Request, Response, NextFunction } from 'express';

export class friendshipController implements IFriendshipController {
  constructor(private friendshipService: IFriendshipService) {}
  async areInRelation(req: Request, res: Response, next: NextFunction) {
    try {
      const user: currentUser = req.currentUser;
      const otherId = req.body.data.otherId;
      if (!otherId || isNaN(otherId) || otherId < 0) {
        res.status(400).json({ success: false });
        return false;
      }
      const result = await this.friendshipService.findRelationBetween(user.id, otherId);
      res.status(200).json({ success: true, data: result });
      return !!result;
    } catch (error) {
      next(error);
      return false;
    }
  }
  async setRelation(req: Request, res: Response, next: NextFunction) {
    try {
      const user: currentUser = req.currentUser;
      const otherId = req.body.data.otherId;
      if (!otherId || isNaN(otherId) || otherId < 0) {
        res.status(400).json({ success: false });
        return false;
      }
      const areActuallyInAnyRelation = await this.friendshipService.findRelationBetween(user.id, otherId);
      if (areActuallyInAnyRelation) {
        res.status(400).json({ success: false });
        return false;
      }
      const result = await this.friendshipService.insertRelation({
        userId: user.id,
        friendId: otherId,
        status: 'pending',
      });
      if (!result) {
        next(new ErrorHandler('Failed to sent relation offer', 400));
        return false;
      }
      res.status(201).json({ success: true, data: result });
      return result;
    } catch (error) {
      next(error);
      return false;
    }
  }
  async removeRelation(req: Request, res: Response, next: NextFunction) {
    try {
      const user: currentUser = req.currentUser;
      const otherId = req.body.data.otherId;
      if (!otherId || isNaN(otherId) || otherId < 0) {
        res.status(400).json({ success: false });
        return false;
      }
      const result = await this.friendshipService.removeRelation(user.id, otherId);
      res.status(200).json({ success: true, data: result });
      return true;
    } catch (error) {
      next(error);
      return false;
    }
  }
  async acceptRelation(req: Request, res: Response, next: NextFunction) {
    try {
      const user: currentUser = req.currentUser;
      const otherId = req.body.data.otherId;
      const result = await this.friendshipService.acceptRelation(user.id, otherId);
      if (!result) {
        next(new ErrorHandler('Failed to accept relation', 400));
        return false;
      }
      res.status(202).json({ success: true, data: result });
      return true;
    } catch (error) {
      next(error);
      return false;
    }
  }
}
