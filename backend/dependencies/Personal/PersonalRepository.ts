import {type ResultSetHeader, type Pool} from "mysql2/promise";
import type {IPersonalInsertDTO, IPersonalRepository, IPersonalRow, IPersonalUpdateDTO} from "./types.js";

export class PersonalRepository implements IPersonalRepository {
    constructor(private db: Pool) { }
    async getByUserId(userId: number): Promise<IPersonalRow | null> {
        const query = 'SELECT * FROM personal WHERE user_id=:userId';
        const [[result]] = await this.db.query<IPersonalRow[]>(query, {userId});
        return result ?? null;
    }
    async insert(document: IPersonalInsertDTO): Promise<boolean> {
        const query: string = 'INSERT INTO personal (user_id,first_name,last_name,birth_date,living_place,gender) VALUES (:user_id,:first_name,:last_name,:birth_date,:living_place,:gender)';
        const [result] = await this.db.execute<ResultSetHeader>(query, {...document});
        return result.affectedRows > 0;
    }
    async update(userId: number, updateDocument: IPersonalUpdateDTO): Promise<boolean> {
        const allowedKeys: (keyof IPersonalUpdateDTO)[] = ['birth_date', 'first_name', 'last_name', 'living_place', 'gender'] as const;
        let key: keyof IPersonalUpdateDTO;
        const queryKeys: string[] = [];
        const params: Record<string, unknown> = {userId: userId};
        for (key in updateDocument) {
            if (!allowedKeys.includes(key)) continue;
            queryKeys.push(`${key}=:${key}`);
            params[key] = key;
        }
        if (queryKeys.length === 0) return false;
        const fullQuery = queryKeys.join(',');
        const query = `UPDATE personal SET ${fullQuery} WHERE user_id=:userId`;
        const [result] = await this.db.execute<ResultSetHeader>(query, {...params as any});
        return result.affectedRows > 0;
    }
    async isAnyExist(userId: number): Promise<boolean> {
        const query: string = 'SELECT 1 FROM personal WHERE user_id=:userId';
        const [result] = await this.db.query<IPersonalRow[]>(query, {userId});
        return result.length > 0;
    }
    async delete(userId: number): Promise<boolean> {
        const query: string = 'DELETE  FROM personal WHERE user_id=:userId';
        const [result] = await this.db.query(query, {userId});
        return !!result;
    }

}