import { ErrorHandler } from "../../handlers/errorHandler.js";
import type { CommentReactionRepository } from "./CommentReactionRepository.js";
import type {
  CommentReactionInsertDTO,
  CommentReactionRow,
  ICommentReactionsService,
} from "./types.js";

export class CommentReactionService implements ICommentReactionsService {
  constructor(private CommentReactionRepository: CommentReactionRepository) {}
  async findCommentReactions(commentId: number): Promise<CommentReactionRow[]> {
    const result =
      await this.CommentReactionRepository.findByCommentId(commentId);
    if (result.length === 0) {
      throw new ErrorHandler("Field not found", 400);
    }
    return result;
  }
  async findCommentReactionsByType(
    commentId: number,
    type: string,
  ): Promise<CommentReactionRow[]> {
    const result = await this.CommentReactionRepository.findByType(
      type,
      commentId,
    );
    if (result.length === 0) {
      throw new ErrorHandler("Field not found", 400);
    }
    return result;
  }
  async findAllUserReactions(userId: number): Promise<CommentReactionRow[]> {
    const result = await this.CommentReactionRepository.findByAuthor(userId);
    if (result.length === 0) {
      throw new ErrorHandler("Field not found", 400);
    }
    return result;
  }
  async findUserReactionInComment(
    userId: number,
    commentId: number,
  ): Promise<CommentReactionRow | undefined> {
    const result = await this.CommentReactionRepository.findByAuthorInComment(
      userId,
      commentId,
    );
    if (!result) {
      throw new ErrorHandler("Field not found", 400);
    }
    return result;
  }
  async insertCommentReaction(dto: CommentReactionInsertDTO): Promise<boolean> {
    const existingReaction =
      await this.CommentReactionRepository.findByAuthorInComment(
        dto.author_id,
        dto.comment_id,
      );
    if (existingReaction) {
      await this.CommentReactionRepository.delete(
        dto.author_id,
        dto.comment_id,
      );
    }
    const result = await this.CommentReactionRepository.insert(dto);
    if (!result) {
      throw new ErrorHandler("Operation failed", 400);
    }
    return result;
  }
  async updateReactionType(
    reactionId: number,
    newType: string,
  ): Promise<boolean> {
    const existingResult =
      await this.CommentReactionRepository.findById(reactionId);
    if (!existingResult) {
      throw new ErrorHandler("Field not found", 400);
    }
    const result = await this.CommentReactionRepository.updateType(
      reactionId,
      newType,
    );
    if (!result) {
      throw new ErrorHandler("Operation failed", 400);
    }
    return result;
  }
  async deleteUserReactionInComment(
    userId: number,
    commentId: number,
  ): Promise<boolean> {
    const existingResult =
      await this.CommentReactionRepository.findByAuthorInComment(
        userId,
        commentId,
      );
    if (!existingResult) {
      throw new ErrorHandler("Field not found", 400);
    }
    const result = await this.CommentReactionRepository.delete(
      userId,
      commentId,
    );
    if (!result) {
      throw new ErrorHandler("Operation failed", 400);
    }
    return result;
  }
}
