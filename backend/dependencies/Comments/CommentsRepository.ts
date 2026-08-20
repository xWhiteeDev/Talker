import type { ResultSetHeader, Pool } from 'mysql2/promise';
import type { AllowedInsertKeys, CommentInsertDTO, CommentRow, FoundComment, ICommentsRepository } from './types.js';

export class CommentsRepository implements ICommentsRepository {
  constructor(private pool: Pool) {}
  async findByPost(postId: number): Promise<CommentRow[] | null> {
    const query: string = 'SELECT * FROM comments WHERE post_id=:postId';
    const [result] = await this.pool.query<CommentRow[]>(query, { postId });
    return result.length > 0 ? result : null;
  }
  async findByUserId(userId: number, postId: number): Promise<CommentRow[] | null> {
    const query: string = 'SELECT * FROM comments WHERE user_id=:userId AND post_id=:postId';
    const [result] = await this.pool.query<CommentRow[]>(query, { userId, postId });
    return result.length > 0 ? result : null;
  }
  async findById(commentId: number): Promise<FoundComment | undefined> {
    const query: string = `WITH child_comments AS (
    SELECT
        c.post_id as postId,
        c.id as id,
        c.content,
        c.user_id as userId,
        c.created_at as createdAt,
        CONCAT(a.firstName, " ", a.lastName) as fullName
    FROM comments as c
    LEFT JOIN accounts as a ON a.id = c.user_id
    WHERE parent_id = :commentId
),
child_reactions AS (
    SELECT
        rc.commentId,
        rc.type,
        COUNT(*) as reactions_count
    FROM reactions_comment as rc
    INNER JOIN child_comments as cc ON cc.id = rc.commentId
    GROUP BY rc.commentId, rc.type
),
child_reactions_agg AS (
    SELECT
        cr.commentId,
        JSON_OBJECTAGG(cr.type, reactions_count) as reactions
    FROM child_reactions as cr
    GROUP BY cr.commentId
)
SELECT
    c.post_id as postId,
    c.id as id,
    c.user_id as userId,
    c.parent_id as parentId,
    c.content,
    c.created_at as createdAt,
    CONCAT(a.firstName, " ", a.lastName) as fullName,
    COALESCE((
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                "id", cc.id,
                "postId", cc.postId,
                "content", cc.content,
                "userId", cc.userId,
                "createdAt", cc.createdAt,
                "fullName", cc.fullName
            )
        )
        FROM child_comments as cc
    ), JSON_ARRAY()) as childComments,
FROM comments as c
LEFT JOIN accounts as a ON a.id = c.user_id
LEFT JOIN child_reactions_agg as cra ON cra.commentId = :c.id
WHERE c.id = :commentId
LIMIT 1` //TODO
    const [[result]] = await this.pool.query<FoundComment[]>(query, { commentId });
    return result;
  }
  async findByParentId(parentId: number): Promise<CommentRow[] | null> {
    const query: string = 'SELECT * FROM comments WHERE parent_id=:parentId';
    const [result] = await this.pool.query<CommentRow[]>(query, { parentId });
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

    const query = `INSERT INTO comments (${queryKeys.join(',')}) VALUES(${queryKeys.map((v) => `:${v}`).join(',')})`;
    const [result] = await this.pool.execute<ResultSetHeader>(query, { ...queryParams });
    return result.affectedRows > 0;
  }
  async updateContent(commentId: number, newContent: string): Promise<boolean> {
    const query: string = 'UPDATE comments SET content=:newContent WHERE id=:commentId';
    const [result] = await this.pool.execute<ResultSetHeader>(query, { commentId, newContent });
    return result.affectedRows > 0;
  }
  async deleteDocument(commentId: number): Promise<boolean> {
    const query: string = 'DELETE FROM comments WHERE id=:commentId';
    const [result] = await this.pool.execute<ResultSetHeader>(query, { commentId });
    return result.affectedRows > 0;
  }
}
