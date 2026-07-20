import {ErrorHandler} from "../../handlers/errorHandler.js";
import type {IPostReactionRepository, IPostReactionsService, PostReactionInsertDTO, PostReactionRow} from "./types.js";


export class PostReactionService implements IPostReactionsService {
    constructor(private PostReactionRepository: IPostReactionRepository) { }
    async findPostReactions(postId: number): Promise<PostReactionRow[]> {
        const result = await this.PostReactionRepository.findByPostId(postId);
        if (result.length === 0) {
            throw new ErrorHandler('Field not found', 400);
        }
        return result;
    }
    async findPostReactionsByType(postId: number, type: string): Promise<PostReactionRow[]> {
        const result = await this.PostReactionRepository.findByType(type, postId);
        if (result.length === 0) {
            throw new ErrorHandler('Field not found', 400);
        }
        return result;
    }
    async findAllUserReactions(userId: number): Promise<PostReactionRow[]> {
        const result = await this.PostReactionRepository.findByAuthor(userId);
        if (result.length === 0) {
            throw new ErrorHandler('Field not found', 400);
        }
        return result;
    }
    async findUserReactionInPost(userId: number, postId: number): Promise<PostReactionRow | undefined> {
        const result = await this.PostReactionRepository.findByAuthorInPost(userId, postId);
        if (!result) {
            throw new ErrorHandler('Field not found', 400);
        }
        return result;
    }
    async insertPostReaction(dto: PostReactionInsertDTO): Promise<boolean> {
        const existingReaction = await this.PostReactionRepository.findByAuthorInPost(dto.authorId, dto.postId);
        if (existingReaction) {
            await this.PostReactionRepository.delete(dto.authorId, dto.postId);
        }
        const result = await this.PostReactionRepository.insert(dto);
        if (!result) {
            throw new ErrorHandler('Operation failed', 400);
        }
        return result;
    }
    async updateReactionType(reactionId: number, newType: string): Promise<boolean> {
        const existingResult = await this.PostReactionRepository.findById(reactionId);
        if (!existingResult) {
            throw new ErrorHandler('Field not found', 400);
        }
        const result = await this.PostReactionRepository.updateType(reactionId, newType);
        if (!result) {
            throw new ErrorHandler('Operation failed', 400);
        }
        return result;
    }
    async deleteUserReactionInPost(userId: number, postId: number): Promise<boolean> {
        const existingResult = await this.PostReactionRepository.findByAuthorInPost(userId, postId);
        if (!existingResult) {
            throw new ErrorHandler('Field not found', 400);
        }
        const result = await this.PostReactionRepository.delete(userId, postId);
        if (!result) {
            throw new ErrorHandler('Operation failed', 400);
        }
        return result;
    }

}