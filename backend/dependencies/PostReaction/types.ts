import type {RowDataPacket} from "mysql2";

export interface IPostReactionRepository {
    findById(id: number): Promise<PostReactionRow | undefined>;
    findByAuthor(authorId: number): Promise<PostReactionRow[]>;
    findByPostId(postId: number): Promise<PostReactionRow[]>;
    findByType(type: string, postId: number): Promise<PostReactionRow[]>;
    findByAuthorInPost(authorId: number, postId: number): Promise<PostReactionRow | undefined>;

    insert(dto: PostReactionInsertDTO): Promise<boolean>;
    updateType(reactionId: number, newType: string): Promise<boolean>;
    delete(authorId: number, postId: number): Promise<boolean>;
}

export interface IPostReactionsService {
    findPostReactions(postId: number): Promise<PostReactionRow[] | undefined>;
    findPostReactionsByType(postId: number, type: string): Promise<PostReactionRow[] | undefined>;
    findAllUserReactions(userId: number): Promise<PostReactionRow[] | undefined>;
    findUserReactionInPost(userId: number, postId: number): Promise<PostReactionRow | undefined>;
    insertPostReaction(dto: PostReactionInsertDTO): Promise<boolean>;
    updateReactionType(reactionId: number, newType: string): Promise<boolean>;
    deleteUserReactionInPost(userId: number, postId: number): Promise<boolean>;
}

export interface PostReactionRow extends RowDataPacket {
    id: number;
    author_id: number;
    type: string;
    post_id: number;
}
export interface PostReactionInsertDTO {
    authorId: number;
    type: string;
    postId: number;
}

export interface PostReactionUpdateDTO {
    type: string;
}