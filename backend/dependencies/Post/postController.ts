import {ErrorHandler} from "../../handlers/errorHandler.js";
import type {currentUser} from "../Account/types.js";
import type {IPostController, IPostService, PostInsertDTO} from "./types.js";
import type {Request, Response, NextFunction} from 'express';
export class PostController implements IPostController {
    constructor(private PostService: IPostService) { }

    async fetchLatestPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const user: currentUser | undefined = req.currentUser;
            if (!user) {
                next(new ErrorHandler('User does not have their identifier', 400));
                return false;
            }
            const result = await this.PostService.findLatestPosts(user.id);
            if (result == null) {
                next(new ErrorHandler('Failed to fetch posts', 404));
                return false;
            }
            res.status(200).json({success: true, data: result});
            return result;
        } catch (error) {
            next(error);
            return false;
        }
    }
    async insertNewPost(req: Request, res: Response, next: NextFunction) {
        try {
            const user: currentUser | undefined = req.currentUser;
            if (!user) {
                next(new ErrorHandler('User does not have their identifier', 400));
                return false;
            }
            const data = req.body.data;
            const payload: PostInsertDTO = {
                authorId: user.id,
                content: data.content,
                visibleFor: data.visibleFor,
            };
            const insertingResult = await this.PostService.insertPost(payload);
            if (!insertingResult) {
                next(new ErrorHandler('Insert action goes wrong', 500));
                return false;
            }
            res.status(200).json({success: true, data: insertingResult});
            return insertingResult;
        } catch (error) {
            next(error);
            return false;
        }
    }
}