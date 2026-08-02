import type {ResultSetHeader, Pool} from "mysql2/promise";
import type {CommentReactionInsertDTO, CommentReactionRow, ICommentReactionRepository} from "./types.js";


export class CommentReactionRepository implements ICommentReactionRepository {
    constructor(private pool: Pool) {

    };
    async findById(id: number): Promise<CommentReactionRow | undefined> {
        const query: string = 'SELECT * FROM reactions_comment WHERE id=:id LIMIT 1';
        const [[result]] = await this.pool.query<CommentReactionRow[]>(query, {id});
        return result;
    }
    async findByAuthor(authorId: number): Promise<CommentReactionRow[]> {
        const query: string = 'SELECT * FROM reactions_comment WHERE author_id=:authorId';
        const [result] = await this.pool.query<CommentReactionRow[]>(query, {authorId});
        return result;
    }
    async findByCommentId(commentId: number): Promise<CommentReactionRow[]> {
        const query: string = 'SELECT * FROM reactions_comment WHERE comment_id=:commentId';
        const [result] = await this.pool.query<CommentReactionRow[]>(query, {commentId});
        return result;
    }
    async findByType(type: string, commentId: number): Promise<CommentReactionRow[]> {
        const query: string = 'SELECT * FROM reactions_comment WHERE type=:type AND comment_id=:commentId';
        const [result] = await this.pool.query<CommentReactionRow[]>(query, {type, commentId});
        return result;
    }
    async findByAuthorInComment(authorId: number, commentId: number): Promise<CommentReactionRow | undefined> {
        const query: string = 'SELECT * FROM reactions_comment WHERE author_id=:authorId AND comment_id=:commentId';
        const [[result]] = await this.pool.query<CommentReactionRow[]>(query, {authorId, commentId});
        return result;
    }
    async insert(dto: CommentReactionInsertDTO): Promise<boolean> {
        const query: string = 'INSERT INTO reactions_comment (author_id,type,comment_Id) VALUES(:author_id,:type,:comment_id)';
        const [result] = await this.pool.execute<ResultSetHeader>(query, {...dto});
        return result.affectedRows > 0;
    }
    async updateType(reactionId: number, newType: string): Promise<boolean> {
        const query: string = 'UPDATE reactions_comment SET type=:newType WHERE id=:id';
        const [result] = await this.pool.execute<ResultSetHeader>(query, {id: reactionId, newType});
        return result.affectedRows > 0;

    }
    async delete(authorId: number, commentId: number): Promise<boolean> {
        const query: string = 'DELETE FROM reactions_comment WHERE author_id=:authorId AND comment_id=:commentId';
        const [result] = await this.pool.execute<ResultSetHeader>(query, {authorId, commentId});
        return result.affectedRows > 0;
    }

}