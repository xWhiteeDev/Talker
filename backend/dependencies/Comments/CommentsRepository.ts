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
  async findById(userId: number, commentId: number): Promise<FoundComment | undefined> {
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
        rc.comment_id,
        rc.type,
        COUNT(*) as reactions_count
    FROM reactions_comment as rc
    INNER JOIN child_comments as cc ON cc.id = rc.comment_id
    GROUP BY rc.comment_id, rc.type
),
child_reactions_agg AS (
    SELECT
        cr.comment_id,
        JSON_OBJECTAGG(cr.type, reactions_count) as reactions
    FROM child_reactions as cr
    GROUP BY cr.comment_id
),
current_reactions AS (
     SELECT
        rc.comment_id,
        rc.type,
        COUNT(*) as reactions_count
    FROM reactions_comment as rc
    WHERE rc.comment_id=:commentId
    GROUP BY rc.comment_id, rc.type 
),
    current_reactions_agg AS (
    SELECT cr.comment_id,JSON_OBJECTAGG(cr.type, reactions_count) as reactions
    FROM current_reactions as cr
    GROUP BY cr.comment_id
)
SELECT
    c.post_id as postId,
    c.id ,
    c.user_id as userId,
    c.parent_id as parentId,
    c.content,
    DATE_FORMAT(c.created_at, '%Y-%m-%d %H:%i') as createdAt,
    CONCAT(a.firstName, " ", a.lastName) as fullName,
    curra.reactions,
    (SELECT MAX(rc.type) FROM reactions_comment as rc WHERE rc.author_id =:userId AND rc.comment_id =:commentId GROUP BY rc.comment_id) as myReaction,
    COALESCE((
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                "id", cc.id,
                "postId", cc.postId,
                "content", cc.content,
                "userId", cc.userId,
                "createdAt", DATE_FORMAT(cc.createdAt, '%Y-%m-%d %H:%i'),
                "fullName", cc.fullName,
                "reactions", (SELECT cra.reactions FROM child_reactions_agg as cra WHERE cra.comment_id = cc.id ),
                "myReaction", (SELECT MAX(rc.type) FROM reactions_comment as rc WHERE rc.author_id =:userId AND rc.comment_id =cc.id GROUP BY rc.comment_id),
                "commentsCount", (SELECT COUNT(*) FROM comments AS c WHERE c.parent_id=cc.id)

            )
        )
        FROM child_comments as cc
    ), JSON_ARRAY()) as comments
    FROM comments as c
LEFT JOIN accounts as a ON a.id = c.user_id
LEFT JOIN current_reactions_agg as curra ON curra.comment_id=c.id
WHERE c.id = :commentId
LIMIT 1`;
    const [[result]] = await this.pool.query<FoundComment[]>(query, { userId, commentId });
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
      if (!queryParams[key]) {
        queryParams[key] = null;
      }
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
