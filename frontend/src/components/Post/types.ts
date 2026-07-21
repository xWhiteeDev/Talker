export interface PostComponent {
    avatar: string | null;
    authorName: string;
    visibility: string;
    createdAt: string;
    content: string;
    reactions: Record<string, number>;
    activeReaction:string
    id: number;
}
export interface PostReaction {
    name: ReactionUnion;
    count: number;
    isActive: boolean;
}




export interface PostReactions {
    additionalStyle?: React.CSSProperties;
    reactions: ReactionComponent[];
    isActive: boolean;

}

export type ReactionUnion =
    'love' |
    'like' |
    'wow' |
    'wrr' |
    'sad';


export interface ReactionComponent {
    name: ReactionUnion;
    count: number;
    isActive: boolean;
    onReactionAdd(name: string): void;

}