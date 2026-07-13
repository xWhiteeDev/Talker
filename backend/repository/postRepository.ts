import type {IPostRepository, PostInsertDTO, PostRow, PostUpdateDTO} from "../interface/repository/PostRepository.js";
import type {ResultSetHeader, ExecuteValues, Pool} from "mysql2/promise";
export class PostRepository implements IPostRepository {
    constructor(private pool: Pool) {
        console.log(`\x1b[32;1m🚀[PostRepository] Pool injected \x1b[0m`);
    }
    async findById(id: number): Promise<PostRow | undefined> {
        const query: string = 'SELECT * FROM posts WHERE id=:id LIMIT 1';
        const [[result]] = await this.pool.query<PostRow[]>(query, {id});
        return result;
    }
    async insert(dto: PostInsertDTO): Promise<boolean> {
        const query: string = 'INSERT INTO posts (author, authorId, content, visibleFor,photo,video,file,gif,taggedPeopleIds,pinnedPlace) VALUES (:author, :authorId, :content, :visibleFor, :photo, :video, :file, :gif, :taggedPeopleIds, :pinnedPlace';
        const [result] = await this.pool.execute<ResultSetHeader>(query, {
            author: dto.author,
            authorId: dto.authorId,
            content: dto.content,
            visibleFor: dto.visibleFor,
            photo: JSON.stringify(dto.photo) ?? null,
            video: JSON.stringify(dto.video) ?? null,
            file: JSON.stringify(dto.file) ?? null,
            gif: JSON.stringify(dto.gif) ?? null,
            taggedPeopleIds: JSON.stringify(dto.taggetPeopleIds) ?? null,
            pinnedPlace: dto.pinedPlace ?? null
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
        const query: string = 'DELETE * FROM posts WHERE id=:id LIMIT 1';
        const [result] = await this.pool.execute<ResultSetHeader>(query, {id});
        return result.affectedRows > 0;
    }
}