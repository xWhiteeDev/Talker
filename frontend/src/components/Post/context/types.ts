export interface PostReactionContext {
    addReaction(name:string): Promise<unknown>;
}