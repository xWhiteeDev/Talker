import type { Request, Response, NextFunction } from 'express';
import type { CommentBody, CommentInsertDTO, ICommentsController, ICommentsService } from './types.js';
import type { currentUser } from '../Account/types.js';
import { ErrorHandler } from '../../handlers/errorHandler.js';
import type { IPostService } from '../Post/types.js';

export class CommentsController implements ICommentsController {
  constructor(
    private CommentsService: ICommentsService,
    private postService: IPostService,
  ) {}

  async insertComment(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    try {
      const data: CommentBody | undefined = req.body.data;
      const user: currentUser | undefined = req.currentUser;

      if (!data || !user) {
        throw new ErrorHandler('Invalid data', 400);
      }
      const canSeeThisPost = await this.postService.findById(user.id, data.postId);
      if (!canSeeThisPost) {
        throw new ErrorHandler('Access denied', 400);
      }
      const payload: CommentInsertDTO = {
        post_id: data.postId,
        user_id: user.id,
        parent_id: data.parentId,
        content: data.content,
      };
      const result = await this.CommentsService.insertComment(payload);
      if (!result) {
        throw new ErrorHandler('Failed to insert comment', 400);
      }
      res.status(201).json({ success: true, data: result });
      return true;
    } catch (error) {
      next(error);
      return false;
    }
  }
  async findByPostId(req: Request, res: Response, next: NextFunction) {
    try {
      const user: currentUser | undefined = req.currentUser;
      if (!user) {
        throw new ErrorHandler('User not assigned', 403);
      }
      let commentid = req.params['id'];
      if (!commentid) {
        throw new ErrorHandler('Comment id missing', 400);
      }
      const result = await this.CommentsService.findCommentByCommentId(user.id, +commentid);
      if (!result) {
        throw new ErrorHandler('Failed to find comment', 400);
      }
      res.status(201).json({ success: true, data: result });
      return true;
    } catch (error) {
      next(error);
      return false;
    }
  }
}
