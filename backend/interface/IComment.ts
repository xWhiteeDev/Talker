export interface IComment {
    id: string;
    post_id: string;
    author_id: string;
    created_at: string;
    content: string;
    parent_comment_id?: string | null
}

export interface ICommentReaction {
    id:string;
    created_at:string;
    comment_id:string;
    author_id:string;
    type:string //todo types as enum 
}