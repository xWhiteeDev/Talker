export interface PostDetails {

    firstName: string;
    lastName: string;

    visibleFor: string;
    content: string;
    created_at: string;
    photo?: string;
    video?: string;
    file?: string;
    gif?: string;
    taggedPlaceIds?: string[];
    pinnedPlace?: string;

}