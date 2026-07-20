import type {ReactionUnion} from "../components/Post/types";

export interface PostRow {
    id: number;
    author: string;
    author_id: number;
    content: string;
    visiblefor: Visibility;
    created_at: string;
    photo?: string[];
    video?: string[];
    file?: string[];
    gif?: string[];
    taggedPeopleIds?: string[];
    pinedPlace?: string;
    firstName: string;
    lastName: string;
    reactions: PostReaction[];

}

type Visibility = 'public' | 'friends' | 'private';

interface PostReaction {
    name: ReactionUnion;
    count: number;
}