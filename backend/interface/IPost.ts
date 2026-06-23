export interface IPost {
    id:string;
    created_at:string;
    author_id:string;
    content:string;
    visibleFor:string //todo friends, for that one person, for group, for only me
}

export interface IPostReaction {
    id:string;
    created_at:string;
    post_id:string;
    author_id:string;
    type:string //todo types as enum 
}