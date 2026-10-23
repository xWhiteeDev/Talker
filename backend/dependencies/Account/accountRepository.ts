import {type ResultSetHeader, type ExecuteValues, type Pool, type RowDataPacket} from 'mysql2/promise';
import type {IAccountRepository, IAccountRow, IAccountInsertDTO, IAccountUpdateDTO} from './types.js';
import type {TExecutor} from '../../database/helper/transactionRunner.js';

export class AccountRepository implements IAccountRepository {
  constructor(private pool: Pool) {
  }
  async findWithCredentials(email: string): Promise<IAccountRow | null> {
    const [result] = await this.pool.query<IAccountRow[]>('SELECT * FROM accounts WHERE email=:email LIMIT 1', {email});
    if (result.length === 0) return null;
    return result[0] ?? null;
  }
  async findById(id: number): Promise<IAccountRow | null> {
    const [result] = await this.pool.query<IAccountRow[]>('SELECT * FROM accounts WHERE id=:id LIMIT 1', {id});
    if (result.length === 0) return null;
    return result[0] ?? null;
  }
  async isExist(email: string): Promise<boolean> {
    const [result] = await this.pool.query<RowDataPacket[]>('SELECT 1 FROM accounts WHERE email=:email', {email});
    return result.length > 0;
  }
  async insert(data: IAccountInsertDTO,executor:TExecutor = this.pool): Promise<number> {
    const [result] = await executor.execute<ResultSetHeader>(
      'INSERT INTO accounts (email,password,status) VALUES (:email,:password,:status)', {...data},
    );
    return result.insertId;
  }
  async update(data: IAccountUpdateDTO, executor:TExecutor = this.pool): Promise<boolean> {
    const allowedKeys: (keyof IAccountUpdateDTO)[] = ['password', 'status', 'welcome_seen'];
    const queries: string[] = [];
    const queryValues = {} as Record<keyof IAccountUpdateDTO | 'email', unknown>;

    let key: keyof IAccountUpdateDTO;
    for (key in data) {
      if (!allowedKeys.includes(key) || data[key] == null) continue;
      queries.push(`${key}=:${key}`);
      queryValues[key] = data[key];
    }
    queryValues['email'] = data.email;
    if (queries.length == 0) return false;
    const fullQueryPart = queries.join(',');
    const [result] = await executor.execute<ResultSetHeader>(
      `UPDATE accounts SET ${fullQueryPart} WHERE email=:email`,
      queryValues as Record<keyof IAccountUpdateDTO | 'email', ExecuteValues>,
    );
    return result.affectedRows > 0;
  }
  async delete(email: string,  executor: TExecutor = this.pool): Promise<boolean> {
    const [result] = await executor.execute<ResultSetHeader>('DELETE FROM accounts WHERE email=:email', {email: email});
    return result.affectedRows > 0;
  }
}
