import {ErrorHandler} from "../../handlers/errorHandler.js";
import type {currentUser} from "../Account/types.js";
import type {IPostReactionsService, PostReactionInsertDTO} from "./types.js";
import type {Request, Response, NextFunction} from "express";

export class PostReactionController {
    constructor(private postReactionService: IPostReactionsService) {

    }
    async createReaction(req: Request, res: Response, next: NextFunction) {
        const reactionBody = req.body.data;
        const user: currentUser = req.currentUser;
        const payload: PostReactionInsertDTO = {
            authorId: user.id,
            type: reactionBody.type,
            postId: reactionBody.postId
        };
        try {
            const result = await this.postReactionService.insertPostReaction(payload);
            if (!result) {
                next(new ErrorHandler('Failed to push reaction', 400));
                return false;
            }
            res.status(201).json({success: true, data: result});
            return result;
        } catch (error) {
            next(error);
            return false;
        }
    }
    async deleteReaction(req: Request, res: Response, next: NextFunction) {
        const reactionBody = req.body.data;
        const user: currentUser = req.currentUser;
        try {
            const result = await this.postReactionService.deleteUserReactionInPost(user.id, reactionBody.postId);
            if (!result) {
                next(new ErrorHandler('Failed to delete reaction', 400));
                return false;
            }
            res.status(201).json({success: true, data: result});
            return result;
        } catch (error) {
            next(error);
            return false;
        }
    }

}