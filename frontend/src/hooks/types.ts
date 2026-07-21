import type {ReactionUnion} from "../components/Post/types";

export interface PostRow {
    id: number,
    created_at: string,
    author_id: number,
    content: string,
    visiblefor: Visibility,
    photo: string[] | null,
    video: string[] | null,
    file: string[] | null,
    gif: string[] | null,
    taggedPeopleIds: string[],
    pinnedPlace: string,
    firstName: string,
    lastName: string,
    reactions_object: Record<ReactionUnion, number>,
    myReaction: string;

}

type Visibility = 'public' | 'friends' | 'private';
