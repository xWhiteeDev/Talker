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
}

export interface PostRow {
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
  visibleFor: string;
  fullName: string;
  comments: Comment[] | null;
  reactions:  Record<ReactionUnion, number>;
  myReaction: ReactionUnion;
}
