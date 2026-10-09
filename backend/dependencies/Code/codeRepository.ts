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
        const query: string = 'INSERT INTO code (email,type,code,expiresAt) VALUES(:email,:type,:code,:expiresAt)';
        const [result] = await this.dbPool.execute<ResultSetHeader>(query, {...document});
        return result.affectedRows > 0;
    }
    async update(email: string, type: TCodeType, updateDocument: ICodeUpdateDTO): Promise<boolean> {
        const query: string = 'UPDATE code SET code=:code, expiresAt=:expiresAt, attempts=:attempts WHERE email=:email AND type=:type';
        const [result] = await this.dbPool.execute<ResultSetHeader>(query, {email, type, ...updateDocument});
        return result.affectedRows > 0;
    }
    async isAnyExist(email: string, type: TCodeType): Promise<boolean> {
        const query: string = 'SELECT 1 FROM code WHERE email=:email AND type=:type LIMIT 1';
        const [[result]] = await this.dbPool.query<ICodeRow[]>(query, {email, type});
        return !!result;
    }
    async delete(email: string, type: TCodeType): Promise<boolean> {
        const query = 'DELETE FROM code WHERE email=:email AND type=:type LIMIT 1';
        const [result] = await this.dbPool.execute<ResultSetHeader>(query, {email, type});
        return result.affectedRows > 0;
    }
}