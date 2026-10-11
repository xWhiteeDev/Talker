import type {Pool, ResultSetHeader} from "mysql2/promise";
import type {ICode, ICodeInsertDTO, ICodeRepository, ICodeRow, ICodeUpdateDTO, TCodeType} from "./types.js";

export class CodeRepository implements ICodeRepository {
    constructor(private dbPool: Pool) { }
    async get(email: string, type: TCodeType): Promise<ICode | undefined> {
        const query: string = 'SELECT * FROM code WHERE email=:email AND type=:type LIMIT 1';
        const [[result]] = await this.dbPool.query<ICodeRow[]>(query, {email, type});
        return result;
    }
    async getAllFor(email: string): Promise<ICode[] | undefined> {
        const query: string = 'SELECT * FROM code WHERE email=:email';
        const [result] = await this.dbPool.query<ICodeRow[]>(query, {email});
        return result.length === 0 ? undefined : result;
    }
    async insert(document: ICodeInsertDTO) {
        const query: string = 'INSERT INTO code (email,type,code,expires_at) VALUES(:email,:type,:code,:expires_at)';
        const [result] = await this.dbPool.execute<ResultSetHeader>(query, {...document});
        return result.affectedRows > 0;
    }
    async update(email: string, type: TCodeType, updateDocument: ICodeUpdateDTO): Promise<boolean> {
        const allowedKeys: (keyof ICodeUpdateDTO)[] = ['attempts', 'code', 'expires_at'];
        const queryKeys: string[] = [];
        const queryParams: Partial<Record<keyof ICodeUpdateDTO, unknown>> = {};
        let key: keyof ICodeUpdateDTO;
        for (key in updateDocument) {
            if (!allowedKeys.includes(key)) {
                continue;
            }
            queryKeys.push(`${key}=:${key}`);
            queryParams[key] = updateDocument[key];
        }
        if (queryKeys.length === 0 || Object.keys(queryParams).length === 0) return false;
        const fullQuery: string = queryKeys.join(',');
        const query: string = `UPDATE code SET ${fullQuery} WHERE email=:email AND type=:type`;
        const [result] = await this.dbPool.execute<ResultSetHeader>(query, {email, type, ...queryParams as any});
        return result.affectedRows > 0;
    }
    async isAnyExist(email: string, type: TCodeType): Promise<boolean> {
        const query: string = 'SELECT 1 FROM code WHERE email=:email AND type=:type LIMIT 1';
        const [[result]] = await this.dbPool.query<ICodeRow[]>(query, {email, type});
        return !!result;
    }
    async reserveAttempt(email: string, type: TCodeType): Promise<boolean> {
        const query: string = 'UPDATE code SET attempts=attempts+1 WHERE email=:email AND type=:type AND attempts < 5 LIMIT 1';
        const [updateResult] = await this.dbPool.execute<ResultSetHeader>(query, {email, type});
        return updateResult.affectedRows > 0;
    }
    async deleteWhenExhausted(email: string, type: TCodeType): Promise<boolean> {
        const query: string = 'DELETE FROM code WHERE email=:email AND type=:type AND attempts=5';
        const [result] = await this.dbPool.execute<ResultSetHeader>(query, {email, type});
        return result.affectedRows > 0;
    }
    async delete(email: string, type: TCodeType): Promise<boolean> {
        const query = 'DELETE FROM code WHERE email=:email AND type=:type LIMIT 1';
        const [result] = await this.dbPool.execute<ResultSetHeader>(query, {email, type});
        return result.affectedRows > 0;
    }
}