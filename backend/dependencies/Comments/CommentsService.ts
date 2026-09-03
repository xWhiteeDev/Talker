import {ErrorHandler} from "../../handlers/errorHandler.js";
import type {CommentInsertDTO, CommentRow, FoundComment, ICommentsRepository, ICommentsService} from "./types.js";

export class CommentsService implements ICommentsService {
    constructor(private CommentsRepository: ICommentsRepository) {

    }
    async findCommentsByPost(postId: number): Promise<CommentRow[]> {
        const result = await this.CommentsRepository.findByPost(postId);
        if (!result) {
            throw new ErrorHandler('Comments not found', 400);
        }
        return result;
    }
    async findUserCommentsByPostId(userId: number, postId: number): Promise<CommentRow[]> {
        const result = await this.CommentsRepository.findByPost(postId);
        if (!result) {
            throw new ErrorHandler('Comments not found', 400);
        }
        return result;
    }
    async findCommentByCommentId(userId:number,commentId: number): Promise<FoundComment> {
        const result = await this.CommentsRepository.findById(userId,commentId);
        if (!result) {
            throw new ErrorHandler('Comments not found', 400);
        }
        return result;
    }
    async findCommentsByParentId(parentId: number): Promise<CommentRow[]> {
        const result = await this.CommentsRepository.findByParentId(parentId);
        if (!result) {
            throw new ErrorHandler('Comments not found', 400);
        }
        return result;
    }
    async insertComment(dto: CommentInsertDTO): Promise<boolean> {
        const result = await this.CommentsRepository.insertDocument(dto);
        if (!result) {
            throw new ErrorHandler('Operation failed', 400);
        }
        return result;
    }
    async updateCommentContent(commentId: number, newContent: string): Promise<boolean> {
        const result = await this.CommentsRepository.updateContent(commentId, newContent);
        if (!result) {
            throw new ErrorHandler('Operation failed', 400);
        }
        return result;
    }
    async deleteComment(commentId: number): Promise<boolean> {
        const result = await this.CommentsRepository.deleteDocument(commentId);
        if (!result) {
            throw new ErrorHandler('Operation failed', 400);
        }
        return result;
    }

}