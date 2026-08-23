import type { ResultSetHeader, ExecuteValues, Pool } from 'mysql2/promise';
import type { IPostRepository, PostInsertDTO, PostRow, PostUpdateDTO } from './types.js';
export class PostRepository implements IPostRepository {
  constructor(private pool: Pool) {
    console.log(`\x1b[32;1m🚀[PostRepository] Pool injected \x1b[0m`);
  }
  async findById(id: number, currentUserId?: number, withDetails?: boolean): Promise<PostRow | undefined> {
    let query: string =
      'SELECT posts.id, posts.created_at,posts.author_id,posts.content,posts.visible_for,posts.photo,posts.video,posts.file,posts.gif,posts.tagged_users,posts.pinned_place,accounts.firstName,accounts.lastName FROM posts LEFT JOIN accounts ON accounts.id=posts.author_id WHERE posts.id=:id LIMIT 1';
    if (withDetails) {
      query = `WITH 
    post_comments AS (
        SELECT 
            c.id AS commentId, 
            c.user_id AS userId, 
            c.post_id AS post_Id, 
            DATE_FORMAT(c.created_at, '%Y-%m-%d %H:%i') AS createdAt, 
            c.content, 
            CONCAT( a.firstName, " " ,a.lastName) AS fullName 
        FROM comments c 
        LEFT JOIN accounts a 
            ON a.id = c.user_id 
        WHERE c.post_id = :id 
          AND c.parent_id IS NULL
    ), 
    comment_reactions AS (
        SELECT
            rc.comment_id AS commentId,
            rc.type,
            COUNT(*) as reaction_count
        FROM reactions_comment rc
        INNER JOIN post_comments pc 
            ON pc.commentId = rc.comment_id 
        GROUP BY rc.comment_id, rc.type
    ),
    aggCommentReactions AS (
        SELECT 
            commentId, 
            JSON_OBJECTAGG(type, reaction_count) as reactionObject
        FROM comment_reactions 
        GROUP BY commentId
    ),
    commentUserReaction AS (
      SELECT rc.comment_id AS commentId,
        MAX(rc.type) AS myReaction FROM reactions_comment rc
      INNER JOIN post_comments pc ON pc.commentId = rc.comment_id  
      WHERE author_Id =:currentUserId AND comment_id= pc.commentId
      GROUP BY rc.comment_id
    ),
    aggComments AS (
        SELECT 
            pc.post_Id,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', pc.commentId,
                    'fullName', pc.fullName,
                    'content', pc.content, 
                    'createdAt', DATE_FORMAT(pc.createdAt, '%Y-%m-%d %H:%i'),
                    'reactions', acr.reactionObject,
                    'myReaction', cur.myReaction,
                    'commentsCount', (SELECT COUNT(*) FROM comments as c WHERE c.parent_id = pc.commentId)
                )
            ) AS commentsArr 
        FROM post_comments pc
        LEFT JOIN aggCommentReactions acr 
            ON acr.commentId = pc.commentId
        LEFT JOIN commentUserReaction cur ON cur.commentId=pc.commentId
        GROUP BY pc.post_Id
    ),
    post_reactions AS (
        SELECT 
            rp.id, 
            rp.author_id, 
            rp.type, 
            rp.post_id  
        FROM reactions_post rp 
        WHERE rp.post_id = :id
    ), 
    post_reactions_grouped AS (
        SELECT 
            pr.post_id, 
            COUNT(*) AS reaction_count, 
            pr.type  
        FROM post_reactions pr 
        GROUP BY pr.post_id, pr.type
    ),
    aggPostReactions AS (
        SELECT 
            prg.post_id, 
            JSON_OBJECTAGG(prg.type, prg.reaction_count) AS reactionObject 
        FROM post_reactions_grouped prg
        GROUP BY prg.post_id
    ),
    userReaction AS (
        SELECT 
            pr.post_id,
            MAX(pr.type) AS myReaction  
        FROM post_reactions pr 
        WHERE pr.author_id = :currentUserId 
          AND pr.post_id = :id
        GROUP BY pr.post_id
    )
SELECT 
    p.id, 
    p.author_Id as authorId , 
    p.content, 
    DATE_FORMAT(p.created_at, '%Y-%m-%d %H:%i') as createdAt, 
    p.visible_for as visibleFor, 
    CONCAT(a.firstName," ", a.lastName) AS fullName, 
    COALESCE(agc.commentsArr, JSON_ARRAY()) AS comments, 
    apr.reactionObject AS reactions, 
    ur.myReaction AS myReaction 
FROM posts p 
LEFT JOIN accounts a 
    ON a.id = p.author_Id 
LEFT JOIN aggComments agc 
    ON agc.post_Id = p.id 
LEFT JOIN aggPostReactions apr 
    ON apr.post_id = p.id 
LEFT JOIN userReaction ur 
    ON ur.post_id = p.id 
WHERE p.id = :id;`;
    }
    const [[result]] = await this.pool.query<PostRow[]>(query, {
      id,
      currentUserId: currentUserId,
    });
    console.log(result)
    return result;
  }
  async findByAuthor(authorId: number): Promise<PostRow[]> {
    const query: string = 'SELECT * FROM posts WHERE authorId=:authorId';
    const [result] = await this.pool.query<PostRow[]>(query, { authorId });
    return result;
  }
  async insert(dto: PostInsertDTO): Promise<boolean> {
    const query: string =
      'INSERT INTO posts (author_Id, content, visible_for,photo,video,file,gif,tagged_users,pinned_place) VALUES (:authorId, :content, :visible_for, :photo, :video, :file, :gif, :tagged_users, :pinned_place)';
    const [result] = await this.pool.execute<ResultSetHeader>(query, {
      authorId: dto.authorId,
      content: dto.content,
      visible_for: dto.visible_for,
      photo: JSON.stringify(dto.photo) ?? null,
      video: JSON.stringify(dto.video) ?? null,
      file: JSON.stringify(dto.file) ?? null,
      gif: JSON.stringify(dto.gif) ?? null,
      tagged_users: JSON.stringify(dto.tagged_users) ?? null,
      pinned_place: dto.pinned_place ?? null,
    });
    return result.affectedRows > 0;
  }
  async update(id: number, dto: PostUpdateDTO): Promise<boolean> {
    const allowedKeysToUpdate: (keyof PostUpdateDTO)[] = [
      'content',
      'visible_for',
      'photo',
      'video',
      'file',
      'gif',
      'tagged_users',
      'pinned_place',
    ] as const;
    let key: keyof PostUpdateDTO;
    const updateKeys: string[] = [];
    const updateParams: Partial<Record<keyof PostUpdateDTO, unknown>> = {};
    for (key in dto) {
      if (!allowedKeysToUpdate.includes(key)) continue;
      if (dto[key] == undefined) continue;
      const fullKeyName: string = `${key}=:${key}`;
      updateKeys.push(fullKeyName);
      if (typeof dto[key] == 'object') {
        updateParams[key] = JSON.stringify(dto[key]);
      } else {
        updateParams[key] = dto[key];
      }
    }
    if (Object.keys(updateParams).length == 0) return false;
    updateParams['id'] = id;
    const connectedQueryValues: string = updateKeys.join(',');
    const fullLiteralQueryString: string = `UPDATE posts SET ${connectedQueryValues} WHERE id=:id LIMIT 1`;
    const [result] = await this.pool.execute<ResultSetHeader>(fullLiteralQueryString, updateParams as ExecuteValues);
    return result.affectedRows > 0;
  }
  async delete(id: number): Promise<boolean> {
    const query: string = 'DELETE FROM posts WHERE id=:id LIMIT 1';
    const [result] = await this.pool.execute<ResultSetHeader>(query, { id });
    return result.affectedRows > 0;
  }
  async findAll(userId: number): Promise<PostRow[]> {
    const query: string = `
  WITH post_reactions AS (
    SELECT 
      post_id,
      type,
      COUNT(type) AS reactionCount 
    FROM reactions_post 
    GROUP BY post_id, type
  ), 
  agg_reactions AS (
    SELECT 
      post_id, 
      JSON_OBJECTAGG(post_reactions.type, post_reactions.reactionCount) AS reactions 
    FROM post_reactions 
    GROUP BY post_id
  )
  SELECT 
    posts.id AS id,
    DATE_FORMAT(posts.created_at, '%Y-%m-%d %H:%i') as createdAt, 
    posts.author_id AS authorId,
    posts.content AS content,
    posts.visible_for AS visibleFor,
    CONCAT(accounts.firstName, " ", accounts.lastName) as fullName,
    agg_reactions.reactions AS reactions, 
    MAX(CASE WHEN reactions_post.author_id = :userId THEN reactions_post.type END) AS myReaction,
    (SELECT COUNT(*) FROM comments AS c WHERE c.post_id=posts.id) AS commentsCount,
    posts.photo AS photo,
    posts.video AS video,
    posts.file AS file,
    posts.gif AS gif,
    posts.tagged_users AS taggedUsers,
    posts.pinned_place AS pinnedPlace
  FROM posts 
  JOIN accounts 
    ON posts.author_id = accounts.id 
  LEFT JOIN reactions_post 
    ON reactions_post.post_id = posts.id 
  LEFT JOIN agg_reactions 
    ON agg_reactions.post_id = posts.id 
  WHERE (
    posts.visible_for = 'public' 
    OR (
      posts.visible_for = 'friends' 
      AND posts.author_id IN (
        SELECT 
          CASE WHEN userId = :userId THEN friendId ELSE userId END 
        FROM friendships 
        WHERE (userId = :userId OR friendId = :userId) 
          AND status = 'accepted'
      )
    )
  ) 
  GROUP BY posts.id 
  ORDER BY posts.id DESC
`;


const [result] = await this.pool.query<PostRow[]>(query, { userId });
    console.log(result)
    return result;
  }
}
