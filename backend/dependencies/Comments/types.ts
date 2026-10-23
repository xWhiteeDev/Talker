import type {RowDataPacket} from 'mysql2';
import type {Request, Response, NextFunction} from 'express';
import type {TExecutor} from '../../database/helper/transactionRunner.js';

export interface ICommentsRepository {
  findByPost(postId: number): Promise<CommentRow[] | null>;
  findByUserId(userId: number, postId: number): Promise<CommentRow[] | null>;
  findById(userId: number, commentId: number): Promise<FoundComment | undefined>;
  findByParentId(parentId: number): Promise<CommentRow[] | null>;
  insertDocument(dto: CommentInsertDTO, executor?: TExecutor): Promise<boolean>;
  updateContent(commentId: number, newContent: string, executor?: TExecutor): Promise<boolean>;
  deleteDocument(commentId: number, executor?: TExecutor): Promise<boolean>;
}

export interface ICommentsService {
  findCommentsByPost(postId: number): Promise<CommentRow[] | null>;
  findUserCommentsByPostId(postId: number): Promise<CommentRow[] | null>;
  findCommentByCommentId(userId: number, commentId: number): Promise<FoundComment | null>;
  findCommentsByParentId(parentId: number): Promise<CommentRow[] | null>;
  insertComment(dto: CommentInsertDTO, executor?: TExecutor): Promise<boolean>;
  updateCommentContent(commentId: number, newContent: string, executor?: TExecutor): Promise<boolean>;
  deleteComment(commentId: number, executor?: TExecutor): Promise<boolean>;
}

export interface FoundComment extends RowDataPacket {
  postId: number;
  commentId: number;
  userId: number;
  parentId: number;
  content: string;
  createdAt: string;
  fullName: string;
  childComments: FoundComment[];
}

export interface ICommentsController {
  insertComment(req: Request, res: Response, next: NextFunction): Promise<boolean>;
}

export interface CommentRow extends RowDataPacket {
  id: number;
  post_id: number;
  user_id: number;
  parent_id: number | null;
  content: string;
  created_at: string;
}

export interface CommentInsertDTO {
  post_id: number;
  user_id: number;
  parent_id: number | null;
  content: string;
}
export interface CommentInsertDTO {
  post_id: number;
  user_id: number;
  parent_id: number | null;
  content: string;
}

export type AllowedInsertKeys = 'post_id' | 'user_id' | 'parent_id' | 'content';

export interface CommentBody {
  content: string;
  postId: number;
  parentId: number | null;
}
