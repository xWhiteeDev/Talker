import { type ResultSetHeader, type ExecuteValues, type Pool, type RowDataPacket } from 'mysql2/promise';
import type { IAccountInsertDTO, IAccountRepository, IAccountUpdateDTO } from '../interface/repository/IAccountRepository.js';
import type { IAccountRow } from '../interface/database/IAccount.js';

export class AccountRepository implements IAccountRepository {
    constructor(private pool: Pool) {
        console.log(`\x1b[32;1m🚀[AccountRepository] Pool injected \x1b[0m`)
    }
    async findWithCredentials(email: string): Promise<IAccountRow | null> {
        const [[result]] = await this.pool.query<IAccountRow[]>('SELECT * FROM accounts WHERE email=:email', { email });
        if (!result) return null
        return result
    }
    async isExist(email: string): Promise<boolean> {
        const [[result]] = await this.pool.query<RowDataPacket[]>('SELECT 1 FROM accounts WHERE email=:email', { email })
        return !!result
    }
    async insert(data: IAccountInsertDTO): Promise<boolean> {
        const [result] = await this.pool.execute<ResultSetHeader>('INSERT INTO accounts (email,password,birthdayDate,firstName,lastName) VALUES (:email,:password,:birthdayDate,:firstName,:lastName)', { ...data });
        return result.affectedRows > 0
    }
    async update(data: IAccountUpdateDTO): Promise<boolean> {
        const allowedKeys: (keyof IAccountUpdateDTO)[] = ['password', 'birthdayDate', 'firstName', 'lastName']
        const queries: string[] = [];
        const queryValues = {} as Record<keyof IAccountUpdateDTO | 'email', unknown>;

        let key: keyof IAccountUpdateDTO;
        for (key in data) {
            if (!allowedKeys.includes(key) || data[key] == null) continue
            queries.push(`${key}=:${key}`);
            queryValues[key] = data[key]
        }
        queryValues['email'] = data.email
        if (queries.length == 0) return false;
        const fullQueryPart = queries.join(',');
        const [result] = await this.pool.execute<ResultSetHeader>(`UPDATE accounts SET ${fullQueryPart} WHERE email=:email`, queryValues as Record<keyof IAccountUpdateDTO | 'email', ExecuteValues>);
        return result.affectedRows > 0
    }
    async delete(email: string): Promise<boolean> {
        const [result] = await this.pool.execute<ResultSetHeader>('DELETE FROM accounts WHERE email=:email', { email: email })
        return result.affectedRows > 0
    }

}