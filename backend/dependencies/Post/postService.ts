import {ErrorHandler} from "../../handlers/errorHandler.js";
import type {IAccountRepository} from "../Account/types.js";
import type {PostRow, PostInsertDTO, PostUpdateDTO, IPostService,IPostRepository} from "./types.js";

export class PostService implements IPostService {
    constructor(private PostRepository: IPostRepository, private AccountRepository: IAccountRepository) {
        console.log(`\x1b[32;1m🚀[PostService] PostRepository injected \x1b[0m`);
    }
    async findById(userId: number, id: number): Promise<PostRow | null> {
        const existingPost: PostRow | undefined = await this.PostRepository.findById(id);
        if (!existingPost) throw new ErrorHandler('Post does not exist', 404);

        const postVisibility = existingPost.visibleFor;
        if (postVisibility === 'public') {
            return existingPost;
        }
        if (postVisibility === 'friends') {
            //TODO: Check is in friends
        }


        return existingPost;
    }
    async findByAuthor(userId: number, authorId: number): Promise<PostRow[] | null> {
        if (userId !== authorId) throw new ErrorHandler('Access denied', 403);
        const existingPost = await this.PostRepository.findByAuthor(authorId);
        return existingPost;
    }
    async insertPost(dto: PostInsertDTO): Promise<boolean> {
        const result = await this.PostRepository.insert(dto);
        if (!result) {
            throw new ErrorHandler('Operation failed', 400);
        }
        return result;
    }
    async updatePost(userId: number, id: number, dto: PostUpdateDTO): Promise<boolean> {
        const existingPost: PostRow | undefined = await this.PostRepository.findById(id);
        if (!existingPost) throw new ErrorHandler('Post does not exist', 404);
        if (userId !== existingPost.authorId) throw new ErrorHandler('Access denied', 403);
        const result = await this.PostRepository.update(id, dto);
        if (!result) {
            throw new ErrorHandler('Operation failed', 400);
        }
        return result;
    }
    async deletePost(userId: number, id: number): Promise<boolean> {
        const existingPost: PostRow | undefined = await this.PostRepository.findById(id);
        if (!existingPost) throw new ErrorHandler('Post does not exist', 404);
        if (userId !== existingPost.authorId) throw new ErrorHandler('Access denied', 403);
        const result = await this.PostRepository.delete(id);
        if (!result) {
            throw new ErrorHandler('Operation failed', 400);
        }
        return result;
    }
}