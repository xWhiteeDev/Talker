import type { NextFunction, Request, Response } from 'express';
import type { IPostService } from '../Post/types.js';
import type { CommentReactionService } from './CommentReactionService.js';
import { ErrorHandler } from '../../handlers/errorHandler.js';
import type { currentUser } from '../Account/types.js';
import type { CommentReactionInsertDTO } from './types.js';

export class CommentReactionController {
  constructor(
    private commentReactionService: CommentReactionService,
    private postService: IPostService,
  ) {}
  async createReaction(req: Request, res: Response, next: NextFunction) {
    const reactionBody = req.body.data;
    const user: currentUser = req.currentUser;
    const payload: CommentReactionInsertDTO = {
      author_id: user.id,
      type: reactionBody.type,
      comment_id: reactionBody.commentId,
    };
    const canSeeThisPost = await this.postService.findById(user.id, reactionBody.postId);
    if (!canSeeThisPost) {
      next(new ErrorHandler('Access denied', 400));
      return false;
    }
    try {
      const result = await this.commentReactionService.insertCommentReaction(payload);
      if (!result) {
        next(new ErrorHandler('Failed to push reaction', 400));
        return false;
      }
      res.status(201).json({ success: true, data: result });
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
      const result = await this.commentReactionService.deleteUserReactionInComment(user.id, reactionBody.commentId);
      if (!result) {
        next(new ErrorHandler('Failed to delete reaction', 400));
        return false;
      }
      res.status(201).json({ success: true, data: result });
      return result;
    } catch (error) {
      next(error);
      return false;
    }
  }
}
