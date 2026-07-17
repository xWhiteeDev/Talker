export interface PostComponent {
    avatar: string | null;
    authorName: string;
    visibiliy: string;
    createdAt: string;
    content: string;
}





export interface PostReactions {
    availableReactions: Reaction[];
    additionalStyle?: React.CSSProperties;
}

export type Reaction =
    'fire' |
    'rocket' |
    'love' |
    'like' |
    'wow' |
    'wrr' |
    'sad';


export interface ReactionComponent {
    reaction: Reaction;
}