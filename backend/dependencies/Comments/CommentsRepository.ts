import type {ResultSetHeader, Pool} from "mysql2/promise";
import type {AllowedInsertKeys, CommentInsertDTO, CommentRow, ICommentsRepository} from "./types.js";

export class CommentsRepository implements ICommentsRepository {
    constructor(private pool: Pool) {

    }
    async findByPost(postId: number): Promise<CommentRow[] | null> {
        const query: string = 'SELECT * FROM comments WHERE post_id=:postId';
        const [result] = await this.pool.query<CommentRow[]>(query, {postId});
        return result.length > 0 ? result : null;
    }
    async findByUserId(userId: number, postId: number): Promise<CommentRow[] | null> {
        const query: string = 'SELECT * FROM comments WHERE user_id=:userId AND post_id=:postId';
        const [result] = await this.pool.query<CommentRow[]>(query, {userId, postId});
        return result.length > 0 ? result : null;
    }
    async findById(commentId: number): Promise<CommentRow | null> {
        const query: string = 'SELECT * FROM comments WHERE id=:commentId LIMIT 1';
        const [[result]] = await this.pool.query<CommentRow[]>(query, {commentId});
        return result ?? null;
    }
    async findByParentId(parentId: number): Promise<CommentRow[] | null> {
        const query: string = 'SELECT * FROM comments WHERE parent_id=:parentId';
        const [result] = await this.pool.query<CommentRow[]>(query, {parentId});
        return result.length > 0 ? result : null;
    }
    async insertDocument(dto: CommentInsertDTO): Promise<boolean> {
        const allowedKeys: AllowedInsertKeys[] = ['post_id', 'user_id', 'parent_id', 'content'];
        const queryKeys: string[] = [];
        const queryParams: Record<string, any> = {};
        let key: keyof CommentInsertDTO;
        for (key in dto) {
            if (!allowedKeys.includes(key)) continue;
            queryKeys.push(key);
            queryParams[key] = dto[key];
        }


        const query = `INSERT INTO comments (${queryKeys.join(',')}) VALUES(${queryKeys.map(v => `:${v}`).join(',')})`;
        const [result] = await this.pool.execute<ResultSetHeader>(query, {...queryParams});
        return result.affectedRows > 0;
    }
    async updateContent(commentId: number, newContent: string): Promise<boolean> {
        const query: string = 'UPDATE comments SET content=:newContent WHERE id=:commentId';
        const [result] = await this.pool.execute<ResultSetHeader>(query, {commentId, newContent});
        return result.affectedRows > 0;
    }
    async deleteDocument(commentId: number): Promise<boolean> {
        const query: string = 'DELETE FROM comments WHERE id=:commentId';
        const [result] = await this.pool.execute<ResultSetHeader>(query, {commentId});
        return result.affectedRows > 0;
    }

}