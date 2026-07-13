import type {PostInsertDTO, PostRow, PostUpdateDTO} from "../repository/PostRepository.js";

export interface IPostService {
    findById(userId: number, id: number): Promise<PostRow | null>;
    findByAuthor(userId: number, authorId: number): Promise<PostRow[] | null>;
    insertPost(dto: PostInsertDTO): Promise<boolean>;
    updatePost(userId: number, id: number, dto: PostUpdateDTO): Promise<boolean>;
    deletePost(userId: number, id: number): Promise<boolean>;
}