import type {ResultSetHeader, ExecuteValues, Pool} from 'mysql2/promise';
import type {IPost, IPostRepository, PostInsertDTO, PostRow, PostUpdateDTO} from './types.js';
export class PostRepository implements IPostRepository {
  constructor(private pool: Pool) { }
  async findById(id: number, currentUserId: number, withDetails?: boolean): Promise<PostRow | undefined> {
    let query: string = `WITH
    post_reactions AS (
        SELECT
            post_id,
            COUNT(*) AS reaction_count,
            MAX(
                CASE
                    WHEN author_id = :currentUserId THEN TRUE
                END
            ) AS userReaction
        FROM reactions_post
        WHERE
            post_id = :id
        GROUP BY
            post_id
    ),
    post_comments AS (
        SELECT post_id, COUNT(*) AS comments_count
        FROM comments
        WHERE
            post_id = :id
        GROUP BY
            post_id
    )
SELECT
    p.id,
    DATE_FORMAT(p.created_at, '%Y-%m-%d %H:%i') AS created_at,
    p.author_id,
    p.text,
    p.visible_for,
    p.photo,
    p.video,
    p.file,
    p.gif,
    p.tagged_users,
    p.pinned_place,
    COALESCE(pr.reaction_count, 0) AS reactionCount,
    COALESCE(pc.comments_count, 0) AS commentsCount,
    pr.userReaction,
    CONCAT(
        pers.first_name,
        " ",
        pers.last_name
    ) AS fullName
FROM
    posts AS p
    LEFT JOIN post_reactions AS pr ON p.id = pr.post_id
    LEFT JOIN post_comments AS pc ON p.id = pc.post_id
    LEFT JOIN personal AS pers ON pers.user_id = p.author_id
WHERE
    p.id = :id;`;
    const [[result]] = await this.pool.query<PostRow[]>(query, {id, currentUserId});
    return result;
  }
  async findByAuthor(userId: number, targetId: number): Promise<PostRow[]> {
    const myProfileQuery = `WITH post_reactions AS (
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
    posts.text AS text,
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
  WHERE posts.author_id =:userId
  GROUP BY posts.id 
  ORDER BY posts.id DESC
 `;

    const someoneProfileQuery: string = `WITH post_reactions AS (
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
    posts.text AS text,
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
   ( posts.visible_for = 'Public' AND posts.author_id=:targetId) OR (posts.visible_for = 'Friends' AND posts.author_id=:targetId AND EXISTS(
    SELECT 1 FROM friendships WHERE ((userId=:userId AND friendId=:targetId AND status='accepted') OR (userId=:targetId AND friendId=:userId AND status='accepted'))
    ))
  ) 
  GROUP BY posts.id 
  ORDER BY posts.id DESC
 `;
    const queryParams = {
      queries: {
        someone: someoneProfileQuery,
        my: myProfileQuery,
      },
      params: {
        someone: {userId, targetId},
        my: {userId},
      },
    };

    const type = userId === targetId ? 'my' : 'someone';

    const [result] = await this.pool.query<PostRow[]>(queryParams.queries[type], queryParams.params[type]);
    return result;
  }
  async insert(dto: PostInsertDTO, executor: Pool = this.pool): Promise<number> {
    const query: string =
      'INSERT INTO posts (author_Id, text, visible_for,photo,video,file,gif,tagged_users,pinned_place) VALUES (:authorId, :text, :visible_for, :photo, :video, :file, :gif, :tagged_users, :pinned_place)';
    const [result] = await executor.execute<ResultSetHeader>(query, {
      authorId: dto.authorId,
      text: dto.text,
      visible_for: dto.visible_for,
      photo: dto.photo && dto.photo?.length > 0 ? JSON.stringify(dto.photo) : null,
      video: dto.video && dto.video?.length > 0 ? JSON.stringify(dto.video) : null,
      file: dto.file && dto.file?.length > 0 ? JSON.stringify(dto.file) : null,
      gif: dto.gif && dto.gif.length > 0 ? JSON.stringify(dto.gif) : null,
      tagged_users: dto.tagged_users ? JSON.stringify(dto.tagged_users) : null,
      pinned_place: dto.pinned_place ?? null,
    });
    return result.insertId;
  }
  async update(id: number, dto: PostUpdateDTO, executor: Pool = this.pool): Promise<boolean> {
    const allowedKeysToUpdate: (keyof PostUpdateDTO)[] = [
      'text',
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
      if (typeof dto[key] == 'object' && dto[key] !== null) {
        updateParams[key] = JSON.stringify(dto[key]);
      } else {
        updateParams[key] = dto[key];
      }
    }
    if (Object.keys(updateParams).length == 0) return false;
    const connectedQueryValues: string = updateKeys.join(',');
    const fullLiteralQueryString: string = `UPDATE posts SET ${connectedQueryValues} WHERE id=:id LIMIT 1`;
    const [result] = await executor.execute<ResultSetHeader>(fullLiteralQueryString, {id, ...updateParams} as ExecuteValues);
    return result.affectedRows > 0;
  }
  async delete(id: number, executor: Pool = this.pool): Promise<boolean> {
    const query: string = 'DELETE FROM posts WHERE id=:id LIMIT 1';
    const [result] = await executor.execute<ResultSetHeader>(query, {id});
    return result.affectedRows > 0;
  }
  async findAll(userId: number): Promise<PostRow[] | null> {
    const query: string = `
  WITH post_reactions AS (
    SELECT 
      post_id,
      COUNT(*) AS reactionCount,
      MAX(CASE WHEN rp.author_id=:userId THEN TRUE END) as userReaction
    FROM reactions_post 
    GROUP BY post_id
  )
  SELECT 
    posts.id AS id,
    DATE_FORMAT(posts.created_at, '%Y-%m-%d %H:%i') as created_at, 
    posts.author_id AS authorId,
    posts.text AS text,
    posts.visible_for AS visible_for,
    CONCAT(pers.first_name, " ", pers.last_name) as fullName,
    (SELECT COUNT(*) FROM comments AS c WHERE c.post_id=posts.id) AS commentsCount,
    posts.photo AS photo,
    posts.video AS video,
    posts.file AS file,
    posts.gif AS gif,
    posts.tagged_users AS taggedUsers,
    posts.pinned_place AS pinnedPlace
  FROM posts 
  JOIN personal as pers 
    ON posts.author_id = pers.user_id 
  LEFT JOIN reactions_post 
    ON reactions_post.post_id = posts.id 
  WHERE (
    posts.visible_for = 'public' 
    OR (
      posts.visible_for = 'friends' 
      AND posts.author_id IN (
        SELECT 
          CASE WHEN user_id = :userId THEN friend_id ELSE user_id END 
        FROM friendships 
        WHERE (user_id = :userId OR friend_id = :userId) 
          AND status = 'accepted'
      ) OR posts.author_id=:userId
    ) OR (posts.visible_for = 'private' AND posts.author_id=:userId)
  ) 
  GROUP BY posts.id 
  ORDER BY posts.id DESC
`;

    const [result] = await this.pool.query<PostRow[]>(query, {userId});
    if (result.length === 0) return null;
    return result;
  }
}
