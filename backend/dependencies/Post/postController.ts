
import {ErrorHandler} from "../../handlers/errorHandler.js";
import type {ICurrentUser} from "../Account/types.js";
import type {IPostService, PostInsertDTO} from "./types.js";
import type {Request, Response, NextFunction} from 'express';
export class PostController {
    constructor(private PostService: IPostService) { }

    async fetchLatestPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const user: ICurrentUser | undefined = req.currentUser;
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
            console.error(error)
            return false;
        }
    }
    async getSpecifiedPost(req: Request, res: Response, next: NextFunction) {
        try {
            const user: ICurrentUser | undefined = req.currentUser;
            const params = req.params;
            if (!user) {
                next(new ErrorHandler('User does not have their identifier', 400));
                return false;
            }
            if (!params['id'] || Array.isArray(params['id'])) {
                next(new ErrorHandler('ID param not provided', 400));
                return false;
            }
            const result = await this.PostService.findById(user.id, parseInt(params['id']), true);
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
    async insertNewPost(req: Request, res: Response, next: NextFunction): Promise<boolean> {
        try {
            const user: ICurrentUser | undefined = req.currentUser;
            if (!user) {
                throw new ErrorHandler('User does not have their identifier', 400);
            }
            const data = req.body;
            console.log(data);
            const payload: PostInsertDTO = {
                authorId: user.id,
                text: data.text,
                visible_for: data.visibleFor,
            };
            const newPostPayload = await this.PostService.insertPost(payload, user.id);
            res.status(200).json({success: true, data: newPostPayload});
            return true;
        } catch (error) {
            console.error(error);
            next(error);
            return false;
        }
    }
}