import type {ResultSetHeader, ExecuteValues, Pool} from "mysql2/promise";
import type {IPostRepository, PostInsertDTO, PostRow, PostUpdateDTO} from "./types.js";
export class PostRepository implements IPostRepository {
    constructor(private pool: Pool) {
        console.log(`\x1b[32;1m🚀[PostRepository] Pool injected \x1b[0m`);
    }
    async findById(id: number): Promise<PostRow | undefined> {
        const query: string = 'SELECT * FROM posts WHERE id=:id LIMIT 1';
        const [[result]] = await this.pool.query<PostRow[]>(query, {id});
        return result;
    }
    async findByAuthor(authorId: number): Promise<PostRow[]> {
        const query: string = 'SELECT * FROM posts WHERE authorId=:authorId';
        const [result] = await this.pool.query<PostRow[]>(query, {authorId});
        return result;
    }
    async insert(dto: PostInsertDTO): Promise<boolean> {
        const query: string = 'INSERT INTO posts (author_Id, content, visibleFor,photo,video,file,gif,taggedPeopleIds,pinnedPlace) VALUES (:authorId, :content, :visibleFor, :photo, :video, :file, :gif, :taggedPeopleIds, :pinnedPlace)';
        const [result] = await this.pool.execute<ResultSetHeader>(query, {
            authorId: dto.authorId,
            content: dto.content,
            visibleFor: dto.visibleFor,
            photo: JSON.stringify(dto.photo) ?? null,
            video: JSON.stringify(dto.video) ?? null,
            file: JSON.stringify(dto.file) ?? null,
            gif: JSON.stringify(dto.gif) ?? null,
            taggedPeopleIds: JSON.stringify(dto.taggedPeopleIds) ?? null,
            pinnedPlace: dto.pinnedPlace ?? null
        });
        return result.affectedRows > 0;
    }
    async update(id: number, dto: PostUpdateDTO): Promise<boolean> {
        const allowedKeysToUpdate: (keyof PostUpdateDTO)[] = ['content', 'visibleFor', 'photo', 'video', 'file', 'gif', 'taggedPeopleIds', 'pinnedPlace'] as const;
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
        const [result] = await this.pool.execute<ResultSetHeader>(query, {id});
        return result.affectedRows > 0;
    }
    async findAll(userId: number): Promise<PostRow[]> {
        const query: string = `SELECT posts.*, accounts.firstName,accounts.lastName, MAX(CASE WHEN reactions_post.author_id = :userId THEN reactions_post.type END) AS myReaction ,GROUP_CONCAT(reactions_post.type) as reactionsTypes FROM posts JOIN accounts ON posts.author_Id = accounts.id LEFT JOIN reactions_post ON reactions_post.post_id=posts.id WHERE (visibleFor='public' OR (visibleFor='friends' AND posts.author_id IN (SELECT CASE WHEN userId=:userId THEN friendId ELSE userId END FROM friendships WHERE (userId=:userId OR friendId=:userId) AND status='accepted'))) GROUP BY posts.id `;
        const [result] = await this.pool.query<PostRow[]>(query, {userId});
        return result;
    }
}