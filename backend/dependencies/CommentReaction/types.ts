import type {RowDataPacket} from "mysql2/promise";

export interface ICommentReactionRepository {
    findById(id: number): Promise<CommentReactionRow | undefined>;
    findByAuthor(authorId: number): Promise<CommentReactionRow[]>;
    findByCommentId(commentId: number): Promise<CommentReactionRow[]>;
    findByType(type: string, postId: number): Promise<CommentReactionRow[]>;
    findByAuthorInComment(authorId: number, postId: number): Promise<CommentReactionRow | undefined>;

    insert(dto: CommentReactionInsertDTO): Promise<boolean>;
    updateType(reactionId: number, newType: string): Promise<boolean>;
    delete(authorId: number, reactionId: number): Promise<boolean>;
}

export interface ICommentReactionsService {
    findCommentReactions(commentId: number): Promise<CommentReactionRow[] | undefined>;
    findCommentReactionsByType(commentId: number, type: string): Promise<CommentReactionRow[] | undefined>;
    findAllUserReactions(userId: number): Promise<CommentReactionRow[] | undefined>;
    findUserReactionInComment(userId: number, commentId: number): Promise<CommentReactionRow | undefined>;
    insertCommentReaction(dto: CommentReactionInsertDTO): Promise<boolean>;
    updateReactionType(reactionId: number, newType: string): Promise<boolean>;
    deleteUserReactionInComment(userId: number, commentId: number): Promise<boolean>;
}

export interface CommentReactionRow extends RowDataPacket {
    id: number;
    author_id: number;
    type: string;
    comment_id: number;
    created_at:string
}
export interface CommentReactionInsertDTO  {
    author_id: number;
    type: string;
    comment_id: number;
}