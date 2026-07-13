import type {RowDataPacket} from "mysql2";

export interface IPostRepository {
    findById(id: number): Promise<PostRow | undefined>;
    insert(dto: PostInsertDTO): Promise<boolean>;
    update(id: number, dto: PostUpdateDTO): Promise<boolean>;
    delete(id: number): Promise<boolean>;
}

export interface PostRow extends RowDataPacket {
    id: number;
    author: string;
    authorId: string;
    content: string;
    visibleFor: string;
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


