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
  author_Id: number;
  content: string;
  created_at: string;
  visibleFor: string;
  fullName: string;
  comments: Comment[] | null;
  reactions: ReactionCount;
  myReaction: string | null;
}
