import type {RowDataPacket} from 'mysql2';
import type {TExecutor} from '../../database/helper/transactionRunner.js';

export interface IPostRepository {
  findById(id: number, currentUserId: number, withDetails?: boolean): Promise<PostRow | undefined>;
  findByAuthor(userId: number, targetId: number): Promise<PostRow[] | null>;
  insert(dto: PostInsertDTO, executor?:TExecutor): Promise<number>;
  update(id: number, dto: PostUpdateDTO, executor?:TExecutor): Promise<boolean>;
  delete(id: number, executor?:TExecutor): Promise<boolean>;
  findAll(userId: number): Promise<PostRow[] | null>;
}
export interface IPostService {
  findById(userId: number, id: number, withDetails?: boolean): Promise<PostRow | null>;
  findByAuthor(userId: number, authorId: number): Promise<PostRow[] | null>;
  insertPost(dto: PostInsertDTO, currentUserId:number,executor?:TExecutor): Promise<IPost>;
  updatePost(userId: number, id: number, dto: PostUpdateDTO, executor?:TExecutor): Promise<boolean>;
  deletePost(userId: number, id: number, executor?:TExecutor): Promise<boolean>;
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

export interface IPost {
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
  text: string;
  visible_for: Visibility;
  photo?: string[];
  video?: string[];
  file?: string[];
  gif?: string[];
  tagged_users?: number[];
  pinned_place?: string;
};
export interface PostUpdateDTO extends Omit<PostInsertDTO, 'author' | 'authorId'> {
}

type Visibility = 'Public' | 'Friends' | 'Private';
