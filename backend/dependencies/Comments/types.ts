import type {RowDataPacket} from "mysql2";
import type {Request,Response,NextFunction} from "express";


export interface ICommentsRepository {
    findByPost(postId: number): Promise<CommentRow[] | null>;
    findByUserId(userId: number, postId: number): Promise<CommentRow[] | null>;
    findById(commentId: number): Promise<FoundComment | undefined>;
    findByParentId(parentId: number): Promise<CommentRow[] | null>;
    insertDocument(dto: CommentInsertDTO): Promise<boolean>;
    updateContent(commentId: number, newContent: string): Promise<boolean>;
    deleteDocument(commentId: number): Promise<boolean>;
}

export interface ICommentsService {
    findCommentsByPost(postId: number): Promise<CommentRow[] | null>;
    findUserCommentsByPostId(userId: number, postId: number): Promise<CommentRow[] | null>;
    findCommentByCommentId(commentId: number): Promise<FoundComment>;
    findCommentsByParentId(parentId: number): Promise<CommentRow[] | null>;
    insertComment(dto: CommentInsertDTO): Promise<boolean>;
    updateCommentContent(commentId: number, newContent: string): Promise<boolean>;
    deleteComment(commentId: number): Promise<boolean>;
}

export interface FoundComment extends RowDataPacket {
    postId:number;
    commentId:number;
    userId:number;
    parentId:number;
    content:string;
    createdAt:string;
    fullName:string;
    childComments:FoundComment[]
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