import type { RowDataPacket } from 'mysql2';

export interface IPostRepository {
  findById(id: number, currentUserId?: number, withDetails?: boolean): Promise<PostRow | undefined>;
  findByAuthor(userId: number,targetId:number): Promise<PostRow[] | null>;
  insert(dto: PostInsertDTO): Promise<boolean>;
  update(id: number, dto: PostUpdateDTO): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  findAll(userId: number): Promise<PostRow[]>;
}
export interface IPostService {
  findById(userId: number, id: number, withDetails?: boolean): Promise<PostRow | null>;
  findByAuthor(userId: number, authorId: number): Promise<PostRow[] | null>;
  insertPost(dto: PostInsertDTO): Promise<boolean>;
  updatePost(userId: number, id: number, dto: PostUpdateDTO): Promise<boolean>;
  deletePost(userId: number, id: number): Promise<boolean>;
  findLatestPosts(userId: number): Promise<PostRow[] | null>;
}

export interface PostRow extends RowDataPacket {
  id: number;
  createdAt: string;
  authorId: number;
  content: string;
  visible_for: Visibility;
  fullName: string;
  reactions: Record<string, number>;
  myReaction: string;
  commentsCount: number;
  photo: string | null;
  video: string | null;
  file: string | null;
  gif: string | null;
  taggedUsers: string[] | null;
  pinnedPlace: string | null;
}

export type PostInsertDTO = {
  authorId: number;
  content: string;
  visible_for: Visibility;
  photo?: string[];
  video?: string[];
  file?: string[];
  gif?: string[];
  tagged_users?: string[];
  pinned_place?: string;
};
export interface PostUpdateDTO extends Omit<PostInsertDTO, 'author' | 'authorId'> {}

type Visibility = 'Public' | 'Friends' | 'Private';
