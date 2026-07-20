import type {ResultSetHeader, Pool} from "mysql2/promise";
import type {IPostReactionRepository, PostReactionInsertDTO, PostReactionRow} from "./types.js";


export class PostReactionRepository implements IPostReactionRepository {
    constructor(private pool: Pool) {

    };
    async findById(id: number): Promise<PostReactionRow | undefined> {
        const query: string = 'SELECT * FROM reactions_post WHERE id=:id LIMIT 1';
        const [[result]] = await this.pool.query<PostReactionRow[]>(query, {id});
        return result;
    }
    async findByAuthor(authorId: number): Promise<PostReactionRow[]> {
        const query: string = 'SELECT * FROM reactions_post WHERE author_id=:authorId';
        const [result] = await this.pool.query<PostReactionRow[]>(query, {authorId});
        return result;
    }
    async findByPostId(postId: number): Promise<PostReactionRow[]> {
        const query: string = 'SELECT * FROM reactions_post WHERE post_id=:postId';
        const [result] = await this.pool.query<PostReactionRow[]>(query, {postId});
        return result;
    }
    async findByType(type: string, postId: number): Promise<PostReactionRow[]> {
        const query: string = 'SELECT * FROM reactions_post WHERE type=:type AND post_id=:postId';
        const [result] = await this.pool.query<PostReactionRow[]>(query, {type, postId});
        return result;
    }
    async findByAuthorInPost(authorId: number, postId: number): Promise<PostReactionRow | undefined> {
        const query: string = 'SELECT * FROM reactions_post WHERE author_id=:authorId AND post_id=:postId';
        const [[result]] = await this.pool.query<PostReactionRow[]>(query, {authorId, postId});
        return result;
    }
    async insert(dto: PostReactionInsertDTO): Promise<boolean> {
        const query: string = 'INSERT INTO reactions_post (author_id,type,post_id) VALUES(:authorId,:type,:postId)';
        const [result] = await this.pool.execute<ResultSetHeader>(query, {...dto});
        return result.affectedRows > 0;
    }
    async updateType(reactionId: number, newType: string): Promise<boolean> {
        const query: string = 'UPDATE reactions_post SET type=:newType WHERE id=:id';
        const [result] = await this.pool.execute<ResultSetHeader>(query, {id: reactionId, newType});
        return result.affectedRows > 0;

    }
    async delete(authorId: number, postId: number): Promise<boolean> {
        const query: string = 'DELETE FROM reactions_post WHERE author_id=:authorId AND post_id=:postId';
        const [result] = await this.pool.execute<ResultSetHeader>(query, {authorId, postId});
        return result.affectedRows > 0;
    }

}