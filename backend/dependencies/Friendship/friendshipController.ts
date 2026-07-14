import {ErrorHandler} from "../../handlers/errorHandler.js";
import type {currentUser} from "../Account/types.js";
import type {FriendsRelationStatus, IFriendshipController, IFriendshipService} from "./types.js";
import type {Request, Response, NextFunction} from "express";
export class friendshipController implements IFriendshipController {
    constructor(private friendshipService: IFriendshipService) { };
    async areInRelation(req: Request, res: Response, next: NextFunction): Promise<boolean> {
        try {
            const user: currentUser = req.currentUser;
            const otherUserId: number = req.body.otherUserId;
            const result = await this.friendshipService.findRelationBetween(user.id, otherUserId);
            if (!result) {
                next();
                return false;
            }
            return !!result;
        } catch (error) {
            next(error);
        }
        res.status(200).json({message: 'In relation'});
        return true;

    }
    async setRelation(req: Request, res: Response, next: NextFunction): Promise<boolean> {
        try {
            const user: currentUser = req.currentUser;
            const otherUserId: number = req.body.otherUserId;
            const result = await this.friendshipService.insertRelation({
                userId: user.id,
                friendId: otherUserId,
                status: "inprogress"
            });
            if (!result) {
                next();
                return false;
            }
            return result;
        } catch (error) {
            next(error);
        }
        res.status(200).json({message: 'Invite sent'});
        return true;
    }

}