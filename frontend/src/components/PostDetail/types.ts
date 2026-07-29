export interface PostDetails {
  postId: number;
  author_Id: number;
  content: string;
  created_at: string;
  visibleFor: string;
  fullName: string;
  comments: PostDetailsComment[]
  reactions: PostReactions;
  myReaction: ReactionUnion;
}
interface PostDetailsComment {
  content: string;
  fullName: string;
  commentId: number;
  createdAt: string;
}

type ReactionUnion = 'love' | 'like' | 'wow' | 'sad' | 'angry';

type PostReactions = {
  [key in ReactionUnion]: number;
};