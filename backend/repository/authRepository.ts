import { type ResultSetHeader, type ExecuteValues, type Pool, type RowDataPacket } from 'mysql2/promise';
import type { IAuthInsertDTO, IAuthRepository, IAuthUpdateDTO } from '../interface/repository/IAuthRepository.js';
import type { IAccountRow } from '../interface/database/IAccount.js';

export class AuthRepository implements IAuthRepository {
    constructor(private pool: Pool) {
        console.log(`\x1b[32;1m🚀[AuthRepository] Pool injected \x1b[0m`)
    }
    async findByEmail(email: string): Promise<IAccountRow | null> {
        const [[result]] = await this.pool.query<IAccountRow[]>('SELECT * FROM accounts WHERE email=:email', { email });
        if (!result) return null
        return result
    }
    async isExist(email: string): Promise<boolean> {
        const [result] = await this.pool.query<RowDataPacket[]>('SELECT 1 FROM accounts WHERE email=:email', { email })
        return !!result
    }
    async insert(data: IAuthInsertDTO): Promise<boolean> {
        const [result] = await this.pool.execute<ResultSetHeader>('INSERT INTO accounts (email,password,birthdayDate,firstName,lastName) VALUES (:email,:password,:birthdayDate,:firstName,:lastName)', { ...data });
        return result.affectedRows > 0
    }
    async update(data: IAuthUpdateDTO): Promise<boolean> {
        const allowedKeys: (keyof IAuthUpdateDTO)[] = ['password', 'birthdayDate', 'firstName', 'lastName']
        const queries: string[] = [];
        const queryValues = {} as Record<keyof IAuthUpdateDTO | 'email', unknown>;

        let key: keyof IAuthUpdateDTO;
        for (key in data) {
            if (!allowedKeys.includes(key) || data[key] == null) continue
            queries.push(`${key}=:${key}`);
            queryValues[key] = data[key]
        }
        queryValues['email'] = data.email
        if (queries.length == 0) return false;
        const fullQueryPart = queries.join(',');
        const [result] = await this.pool.execute<ResultSetHeader>(`UPDATE accounts SET ${fullQueryPart} WHERE email=:email`, queryValues as Record<keyof IAuthUpdateDTO | 'email', ExecuteValues>);
        return result.affectedRows > 0
    }
    async delete(email: string): Promise<boolean> {
        const [result] = await this.pool.execute<ResultSetHeader>('DELETE FROM accounts WHERE email=:email', { email: email })
        return result.affectedRows > 0
    }

}