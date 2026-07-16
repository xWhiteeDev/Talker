export interface PostRow {
    id: number;
    author: string;
    authorId: number;
    content: string;
    visibleFor: Visibility;
    created_at: string;
    photo?: string[];
    video?: string[];
    file?: string[];
    gif?: string[];
    taggetPeopleIds?: string[];
    pinedPlace?: string;

}
type Visibility = 'public' | 'friends' | 'private';