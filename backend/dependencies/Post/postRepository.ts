import type { ResultSetHeader, ExecuteValues, Pool } from "mysql2/promise";
import type {
  IPostRepository,
  PostInsertDTO,
  PostRow,
  PostUpdateDTO,
} from "./types.js";
export class PostRepository implements IPostRepository {
  constructor(private pool: Pool) {
    console.log(`\x1b[32;1m🚀[PostRepository] Pool injected \x1b[0m`);
  }
  async findById(
    id: number,
    currentUserId?:number,
    withDetails?: boolean,
  ): Promise<PostRow | undefined> {
    let query: string =
      "SELECT posts.id, posts.created_at,posts.author_id,posts.content,posts.visibleFor,posts.photo,posts.video,posts.file,posts.gif,posts.taggedPeopleIds,posts.pinnedPlace,accounts.firstName,accounts.lastName FROM posts LEFT JOIN accounts ON accounts.id=posts.author_id WHERE posts.id=:id LIMIT 1";
    if (withDetails) {
      query = `WITH post_comments AS (SELECT c.id AS commentId, c.user_id as userId, c.post_id as post_Id ,c.created_at as createdAt, c.content, CONCAT(' ', a.firstName, a.lastName) as fullName FROM comments c LEFT JOIN accounts a ON a.id  = c.user_id WHERE c.post_id=:id AND c.parent_id IS NULL), 
            aggComments AS (SELECT JSON_ARRAYAGG(JSON_OBJECT('commentId', pc.commentId,'fullName', pc.fullName,'content', pc.content, 'createdAt', pc.createdAt)) as commentsArr FROM post_comments pc), 
            post_reactions AS (SELECT rp.id,rp.author_id,rp.type,rp.post_id  FROM reactions_post rp WHERE rp.post_id =:id), 
            post_reactions_grouped AS (SELECT pr.post_id, COUNT(*) as reaction_count, pr.type  FROM post_reactions pr GROUP BY pr.post_id,pr.type),
            aggPostReactions AS (SELECT JSON_OBJECTAGG(prg.type,prg.reaction_count) as reactionObject FROM post_reactions_grouped prg),
            userReaction AS (SELECT MAX(pr.type) as myReaction  FROM post_reactions pr WHERE pr.author_id =:currentUserId AND pr.post_id =:id)
            SELECT p.id as postId, p.author_Id, p.content,p.created_at, p.visibleFor, CONCAT(' ', a.firstName,a.lastName) as fullName, agc.commentsArr as comments, apr.reactionObject as reactions, userReaction.myReaction as myReaction FROM posts p LEFT JOIN accounts a ON a.id = p.author_Id LEFT JOIN aggComments agc ON 1=1 LEFT JOIN aggPostReactions apr ON 1=1 LEFT JOIN userReaction ON 1=1 WHERE p.id=:id`;
    }
    const [[result]] = await this.pool.query<PostRow[]>(query, { id, currentUserId:currentUserId });
    console.log(result);
    return result;
  }
  async findByAuthor(authorId: number): Promise<PostRow[]> {
    const query: string = "SELECT * FROM posts WHERE authorId=:authorId";
    const [result] = await this.pool.query<PostRow[]>(query, { authorId });
    return result;
  }
  async insert(dto: PostInsertDTO): Promise<boolean> {
    const query: string =
      "INSERT INTO posts (author_Id, content, visibleFor,photo,video,file,gif,taggedPeopleIds,pinnedPlace) VALUES (:authorId, :content, :visibleFor, :photo, :video, :file, :gif, :taggedPeopleIds, :pinnedPlace)";
    const [result] = await this.pool.execute<ResultSetHeader>(query, {
      authorId: dto.authorId,
      content: dto.content,
      visibleFor: dto.visibleFor,
      photo: JSON.stringify(dto.photo) ?? null,
      video: JSON.stringify(dto.video) ?? null,
      file: JSON.stringify(dto.file) ?? null,
      gif: JSON.stringify(dto.gif) ?? null,
      taggedPeopleIds: JSON.stringify(dto.taggedPeopleIds) ?? null,
      pinnedPlace: dto.pinnedPlace ?? null,
    });
    return result.affectedRows > 0;
  }
  async update(id: number, dto: PostUpdateDTO): Promise<boolean> {
    const allowedKeysToUpdate: (keyof PostUpdateDTO)[] = [
      "content",
      "visibleFor",
      "photo",
      "video",
      "file",
      "gif",
      "taggedPeopleIds",
      "pinnedPlace",
    ] as const;
    let key: keyof PostUpdateDTO;
    const updateKeys: string[] = [];
    const updateParams: Partial<Record<keyof PostUpdateDTO, unknown>> = {};
    for (key in dto) {
      if (!allowedKeysToUpdate.includes(key)) continue;
      if (dto[key] == undefined) continue;
      const fullKeyName: string = `${key}=:${key}`;
      updateKeys.push(fullKeyName);
      if (typeof dto[key] == "object") {
        updateParams[key] = JSON.stringify(dto[key]);
      } else {
        updateParams[key] = dto[key];
      }
    }
    if (Object.keys(updateParams).length == 0) return false;
    updateParams["id"] = id;
    const connectedQueryValues: string = updateKeys.join(",");
    const fullLiteralQueryString: string = `UPDATE posts SET ${connectedQueryValues} WHERE id=:id LIMIT 1`;
    const [result] = await this.pool.execute<ResultSetHeader>(
      fullLiteralQueryString,
      updateParams as ExecuteValues,
    );
    return result.affectedRows > 0;
  }
  async delete(id: number): Promise<boolean> {
    const query: string = "DELETE FROM posts WHERE id=:id LIMIT 1";
    const [result] = await this.pool.execute<ResultSetHeader>(query, { id });
    return result.affectedRows > 0;
  }
  async findAll(userId: number): Promise<PostRow[]> {
    const query: string = `WITH post_reactions AS (SELECT post_id,type,COUNT(type) as reaction_count FROM reactions_post GROUP BY post_id, type), reactions AS (SELECT post_id, JSON_OBJECTAGG(post_reactions.type,post_reactions.reaction_count) AS reactions_object FROM post_reactions GROUP BY post_id) SELECT posts.*, accounts.firstName,accounts.lastName,reactions.reactions_object ,MAX(CASE WHEN reactions_post.author_id = :userId THEN reactions_post.type END) AS myReaction FROM posts JOIN accounts ON posts.author_Id = accounts.id LEFT JOIN reactions_post ON reactions_post.post_id=posts.id LEFT JOIN reactions ON reactions.post_id = posts.id WHERE (visibleFor='public' OR (visibleFor='friends' AND posts.author_id IN (SELECT CASE WHEN userId=:userId THEN friendId ELSE userId END FROM friendships WHERE (userId=:userId OR friendId=:userId) AND status='accepted'))) GROUP BY posts.id ORDER BY posts.id DESC`;
    const [result] = await this.pool.query<PostRow[]>(query, { userId });
    return result;
  }
}
