import type {ReactionUnion} from "../../../../../types/VisualUnions";

export interface PostReaction {
  [key:string]: Reaction
}


export interface Reaction {
    counts: number;
    userReaction:ReactionUnion
}

export interface PostProps {
  avatar: string | null;
  visibility: string;
  authorName: string;
  createdAt: string;
  content: string;
  defaultReactions: PostReaction[];
  addReaction(name: string): Promise<unknown>;
  activeReactionName: ReactionUnion | undefined;
}