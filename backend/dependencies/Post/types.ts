import type {RowDataPacket} from "mysql2";

export interface IPostRepository {
    findById(id: number): Promise<PostRow | undefined>;
    findByAuthor(authorId: number): Promise<PostRow[] | null>;
    insert(dto: PostInsertDTO): Promise<boolean>;
    update(id: number, dto: PostUpdateDTO): Promise<boolean>;
    delete(id: number): Promise<boolean>;
    findAll(userId: number): Promise<PostRow[]>;

}
export interface IPostService {
    findById(userId: number, id: number): Promise<PostRow | null>;
    findByAuthor(userId: number, authorId: number): Promise<PostRow[] | null>;
    insertPost(dto: PostInsertDTO): Promise<boolean>;
    updatePost(userId: number, id: number, dto: PostUpdateDTO): Promise<boolean>;
    deletePost(userId: number, id: number): Promise<boolean>;
    findLatestPosts(userId: number): Promise<PostRow[] | null>;
}

export interface IPostController {

}

export interface PostRow extends RowDataPacket {
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
    taggedPeopleIds?: string[];
    pinedPlace?: string;
    firstName:string;
    lastName:string

}

export type PostInsertDTO = {
    authorId: number;
    content: string;
    visibleFor: Visibility;
    photo?: string[];
    video?: string[];
    file?: string[];
    gif?: string[];
    taggedPeopleIds?: string[];
    pinnedPlace?: string;
}; 
export interface PostUpdateDTO extends Omit<PostInsertDTO, 'author' | 'authorId'> { }


type Visibility = 'public' | 'friends' | 'private';