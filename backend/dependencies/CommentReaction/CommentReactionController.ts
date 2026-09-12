import type { NextFunction, Request, Response } from 'express';
import type { IPostService } from '../Post/types.js';
import type { CommentReactionService } from './CommentReactionService.js';
import { ErrorHandler } from '../../handlers/errorHandler.js';
import type { currentUser } from '../Account/types.js';
import type { CommentReactionInsertDTO } from './types.js';
import type { ICommentsService } from '../Comments/types.js';

export class CommentReactionController {
  constructor(
    private commentReactionService: CommentReactionService,
    private postService: IPostService,
    private commentsService: ICommentsService,
  ) {}
  async createReaction(req: Request, res: Response, next: NextFunction) {
    try {
      const reactionBody = req.body.data;
      const user: currentUser | undefined = req.currentUser;
      if (!user) {
        throw new ErrorHandler('Unauthorised', 401);
      }
      const payload: CommentReactionInsertDTO = {
        author_id: user.id,
        type: reactionBody.type,
        comment_id: reactionBody.commentId,
      };
      const requestedPost = await this.postService.findById(user.id, reactionBody.postId);

      if (!requestedPost) {
        next(new ErrorHandler('Access denied', 400));
        return false;
      }
      const comment = await this.commentsService.findCommentByCommentId(user.id, reactionBody.commentId);
      if (!comment) {
        next(new ErrorHandler('Comment not exist!', 400));
        return false;
      }
      if (comment.postId !== requestedPost.id) {
        next(new ErrorHandler('Comment is not part of that post!', 400));
        return false;
      }

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
    const user: currentUser | undefined = req.currentUser;
    if (!user) {
      throw new ErrorHandler('Unauthorised', 401);
    }
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
