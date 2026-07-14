import type {RowDataPacket} from "mysql2";

export interface IPostRepository {
    findById(id: number): Promise<PostRow | undefined>;
    findByAuthor(authorId: number): Promise<PostRow[] | null>;
    insert(dto: PostInsertDTO): Promise<boolean>;
    update(id: number, dto: PostUpdateDTO): Promise<boolean>;
    delete(id: number): Promise<boolean>;
}
export interface IPostService {
    findById(userId: number, id: number): Promise<PostRow | null>;
    findByAuthor(userId: number, authorId: number): Promise<PostRow[] | null>;
    insertPost(dto: PostInsertDTO): Promise<boolean>;
    updatePost(userId: number, id: number, dto: PostUpdateDTO): Promise<boolean>;
    deletePost(userId: number, id: number): Promise<boolean>;
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
    taggetPeopleIds?: string[];
    pinedPlace?: string;

}

export interface PostInsertDTO extends Exclude<PostRow, 'createdAt' | 'id' | 'constructor' | 'created_at'> { }
export interface PostUpdateDTO extends Exclude<PostRow, 'author' | 'authorId'> { }


type Visibility = 'public' | 'friends' | 'private';