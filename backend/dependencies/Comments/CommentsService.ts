import type {TExecutor} from '../../database/helper/transactionRunner.js';
import type { CommentInsertDTO, CommentRow, FoundComment, ICommentsRepository, ICommentsService } from './types.js';

export class CommentsService implements ICommentsService {
  constructor(private CommentsRepository: ICommentsRepository) {}
  async findCommentsByPost(postId: number): Promise<CommentRow[]> {
    const result = await this.CommentsRepository.findByPost(postId);
    if (!result) {
      return [];
    }
    return result;
  }
  async findUserCommentsByPostId(postId: number): Promise<CommentRow[]> {
    const result = await this.CommentsRepository.findByPost(postId);
    if (!result) {
      return [];
    }
    return result;
  }
  async findCommentByCommentId(userId: number, commentId: number): Promise<FoundComment | null> {
    const result = await this.CommentsRepository.findById(userId, commentId);
    if (!result) {
      return null;
    }
    return result;
  }
  async findCommentsByParentId(parentId: number): Promise<CommentRow[]> {
    const result = await this.CommentsRepository.findByParentId(parentId);
    if (!result) {
      return [];
    }
    return result;
  }
  async insertComment(dto: CommentInsertDTO, executor?:TExecutor): Promise<boolean> {
    const result = await this.CommentsRepository.insertDocument(dto,executor);
    if (!result) {
      return false;
    }
    return result;
  }
  async updateCommentContent(commentId: number, newContent: string, executor?:TExecutor): Promise<boolean> {
    const result = await this.CommentsRepository.updateContent(commentId, newContent,executor);
    if (!result) {
      return false;
    }
    return result;
  }
  async deleteComment(commentId: number, executor?:TExecutor): Promise<boolean> {
    const result = await this.CommentsRepository.deleteDocument(commentId,executor);
    if (!result) {
      return false;
    }
    return result;
  }
}
