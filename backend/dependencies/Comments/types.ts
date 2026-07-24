import type {RowDataPacket} from "mysql2";

export interface ICommentRepository {
    findByPost(postId: number): Promise<CommentRow[] | null>;
    findByUserId(userId:number): Promise<CommentRow[] | null>
}

export interface CommentRow extends RowDataPacket {
    id: number;
    post_id: number;
    user_id: number;
    parent_id: number;
    content: string;
    created_at: string;
}