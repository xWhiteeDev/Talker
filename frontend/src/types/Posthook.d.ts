import type { ReactionUnion } from './VisualUnions';

export interface ReactionCount {
  [key: string]: number;
}

export interface Comment {
  content: string;
  fullName: string;
  commentId: number;
  createdAt: string;
  reactions: Record<ReactionUnion, number>;
  userReaction: ReactionUnion;
  commentsCount: number;
}

export interface PostRow {
  id: number;
  createdAt: string;
  authorId: number;
  content: string;
  visibleFor: string;
  fullName: string;
  reactions: Record<ReactionUnion, number>;
  myReaction: ReactionUnion;
  commentsCount: number;
  photo: string | null;
  video: string | null;
  file: string | null;
  gif: string | null;
  taggedUsers: string | null;
  pinnedPlace: string | null;
}
