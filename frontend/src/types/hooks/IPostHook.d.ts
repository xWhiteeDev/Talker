import type { ReactionUnion } from './VisualUnions';

export interface IReactionCount {
  [key: string]: number;
}

export interface ICommentShape {
  content: string;
  fullName: string;
  commentId: number;
  createdAt: string;
  reactions: Record<ReactionUnion, number>;
  userReaction: ReactionUnion;
  commentsCount: number;
}

export interface IPostShape {
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
