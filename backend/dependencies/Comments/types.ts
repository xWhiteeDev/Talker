import type {RowDataPacket} from "mysql2";
import type {Request,Response,NextFunction} from "express";

export interface ICommentsRepository {
    findByPost(postId: number): Promise<CommentRow[] | null>;
    findByUserId(userId: number, postId: number): Promise<CommentRow[] | null>;
    findById(commentId: number): Promise<CommentRow | null>;
    findByParentId(parentId: number): Promise<CommentRow[] | null>;
    insertDocument(dto: CommentInsertDTO): Promise<boolean>;
    updateContent(commentId: number, newContent: string): Promise<boolean>;
    deleteDocument(commentId: number): Promise<boolean>;
}

export interface ICommentsService {
    findCommentsByPost(postId: number): Promise<CommentRow[] | null>;
    findUserCommentsByPostId(userId: number, postId: number): Promise<CommentRow[] | null>;
    findCommentByCommentId(commentId: number): Promise<CommentRow | null>;
    findCommentsByParentId(parentId: number): Promise<CommentRow[] | null>;
    insertComment(dto: CommentInsertDTO): Promise<boolean>;
    updateCommentContent(commentId: number, newContent: string): Promise<boolean>;
    deleteComment(commentId: number): Promise<boolean>;
}

export interface ICommentsController {
    insertComment(req:Request,res:Response,next:NextFunction): Promise<boolean>
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
    content:string 
    postId:number;
    parentId:number | null
}