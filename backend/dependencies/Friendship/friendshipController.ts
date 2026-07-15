import {ErrorHandler} from "../../handlers/errorHandler.js";
import type {currentUser} from "../Account/types.js";
import type {IFriendshipController, IFriendshipService} from "./types.js";
import type {Request, Response, NextFunction} from "express";

export class friendshipController implements IFriendshipController {
    constructor(private friendshipService: IFriendshipService) { };
    async areInRelation(req: Request, res: Response, next: NextFunction) {
        try {
            const user: currentUser = req.currentUser;
            const result = await this.friendshipService.findRelationBetween(user.id, req.otherUserId!);
            res.status(200).json({isRelated: !!result});
            return !!result;
        } catch (error) {
            next(error);
            return false;
        }
    }
    async setRelation(req: Request, res: Response, next: NextFunction) {
        try {
            const user: currentUser = req.currentUser;

            const result = await this.friendshipService.insertRelation({
                userId: user.id,
                friendId: req.otherUserId!,
                status: "pending"
            });
            if (!result) {
                next(new ErrorHandler('Failed to sent relation offer', 400));
                return false;
            }
            res.status(201).json({isInviteSent: result});
            return result;

        } catch (error) {
            next(error);
            return false;
        }
    }
    async removeRelation(req: Request, res: Response, next: NextFunction) {
        try {
            const user: currentUser = req.currentUser;

            const result = await this.friendshipService.removeRelation(user.id, req.otherUserId!);
            if (!result) {
                next(new ErrorHandler('Failed to remove relation', 400));
                return false;
            }
            res.status(200).json({isRelationDeleted: result});
            return true;
        } catch (error) {
            next(error);
            return false;
        }
    }
    async acceptRelation(req: Request, res: Response, next: NextFunction) {
        try {
            const user: currentUser = req.currentUser;
            const result = await this.friendshipService.acceptRelation(user.id, req.otherUserId!);
            if (!result) {
                next(new ErrorHandler('Failed to accept relation', 400));
                return false;
            }
            res.status(202).json({isAccepted: result});
            return true;
        } catch (error) {
            next(error);
            return false;
        }
    }

}