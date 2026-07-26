import type {Request, Response, NextFunction} from "express";
import type {CommentBody, CommentInsertDTO, ICommentsController, ICommentsService} from "./types.js";
import type {currentUser} from "../Account/types.js";
import {ErrorHandler} from "../../handlers/errorHandler.js";

export class CommentsController implements ICommentsController {
    constructor(private CommentsService: ICommentsService) {

    }
    
    async insertComment(req: Request, res: Response, next: NextFunction): Promise<boolean> {
        const data: CommentBody | undefined = req.body.data;
        const user: currentUser = req.currentUser;

        if (!data || !user) {
            next();
            return false;
        }
        const payload: CommentInsertDTO = {
            post_id: data.postId,
            user_id: user.id,
            parent_id: data.parentId,
            content: data.content
        };
        console.log(payload)
        try {
            const result = await this.CommentsService.insertComment(payload);
            if (!result) {
                next(new ErrorHandler('Failed to insert comment', 400));
                return false;
            }
            res.status(201).json({success: true, data: result});
            return true;
        } catch (error) {
            next(error);
            return false;
        }
    }

}