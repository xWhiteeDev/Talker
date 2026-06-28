import { type ResultSetHeader, type ExecuteValues, type Pool } from 'mysql2/promise';
import type { IAuthRepository, IUpdateDTO } from '../interface/repository/IAuthRepository.js';
import type { IAccountRow } from '../interface/database/IAccount.js';

export class authRepository implements IAuthRepository {
    constructor(private pool: Pool) {
        console.log(`Pool injected: ${this.pool.threadId}`)
    }
    async findByEmail(email: string): Promise<IAccountRow> {
        const [result] = await this.pool.query<IAccountRow>('SELECT * FROM accounts WHERE email=:email', { email: email });
        return result
    }
    async insert(email: string, password: string, birthdayDate: string, firstName: string, lastName: string): Promise<boolean> {
        const [result] = await this.pool.execute<ResultSetHeader>('INSERT INTO accounts (email,password,birthdayDate,firstName,lastName) VALUES (:email,:password,:birthdayDate,:firstName,:lastName)', { email, password, birthdayDate, firstName, lastName });
        return result.affectedRows > 0
    }
    async update(email: string, data: IUpdateDTO): Promise<boolean> {
        const allowedKeys: (keyof IUpdateDTO)[] = ['password', 'birthdayDate', 'firstName', 'lastName']
        const queries: string[] = [];
        const queryValues = {} as Record<keyof IUpdateDTO | 'email', unknown>;

        let key: keyof IUpdateDTO;
        for (key in data) {
            if (!allowedKeys.includes(key) || data[key] == null) continue
            queries.push(`${key}=:${key}`);
            queryValues[key] = data[key]
        }
        queryValues['email'] = email
        if (queries.length == 0) return false;
        const fullQueryPart = queries.join(',');
        const [result] = await this.pool.execute<ResultSetHeader>(`UPDATE accounts SET ${fullQueryPart} WHERE email=:email`, queryValues as Record<keyof IUpdateDTO | 'email', ExecuteValues>);
        return result.affectedRows > 0
    }

}