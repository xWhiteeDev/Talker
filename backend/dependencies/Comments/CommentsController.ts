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
    const data: CommentBody | undefined = req.body.data;
    const user: currentUser = req.currentUser;

    if (!data || !user) {
      next();
      return false;
    }
    const canSeeThisPost = await this.postService.findById(user.id, data.postId);
    if (!canSeeThisPost) {
      next(new ErrorHandler('Access denied', 400));
      return false;
    }
    const payload: CommentInsertDTO = {
      post_id: data.postId,
      user_id: user.id,
      parent_id: data.parentId,
      content: data.content,
    };
    try {
      const result = await this.CommentsService.insertComment(payload);
      if (!result) {
        next(new ErrorHandler('Failed to insert comment', 400));
        return false;
      }
      res.status(201).json({ success: true, data: result });
      return true;
    } catch (error) {
      next(error);
      return false;
    }
  }
  async findByPostId(req: Request, res: Response, next: NextFunction) {
    const user = req.currentUser;
    if (!user) {
      next(new ErrorHandler('User not assigned', 403));
      return false
    }
    let commentid = req.params['id'];
    if (!commentid) {
      next(new ErrorHandler('Comment id missing', 400));
      return false;
    }
    try {
      const result = await this.CommentsService.findCommentByCommentId(+commentid);
      if (!result) {
        next(new ErrorHandler('Failed to find comment', 400));
        return false;
      }
      res.status(201).json({success:true,data:result});
      console.log(`Result sent with this data: ${JSON.stringify(result)}`)
      return true
    } catch (error) {
      next(error);
      return false;
    }
  }
}
