export interface IPost {
    id: number;
    created_at: string;
    author_id: number;
    text: string;
    visible_for: TPostVisibility;
    pinned_place?: string;
    reactionCount: number;
    commentsCount: number;
    userReaction: string;
    fullName: string;
    photo?: string;
    video?: string;
    file?: string;
    gif?: string;
    tagged_users?: string;

}

export type TPostVisibility = 'public' | 'friends' | 'private';