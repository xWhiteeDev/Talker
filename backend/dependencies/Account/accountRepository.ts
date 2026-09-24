import {type ResultSetHeader, type ExecuteValues, type Pool, type RowDataPacket} from 'mysql2/promise';
import type {IAccountRepository, IAccountRow, IAccountInsertDTO, IAccountUpdateDTO} from './types.js';

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
  async findByCriteria(firstString?: string, lastString?: string): Promise<IAccountRow[] | null> {

    let query: string | undefined = undefined;
    if (firstString && lastString) {
      query = 'SELECT CONCAT(firstName," ", lastName) as fullName, id FROM accounts WHERE ((firstName=:firstString AND lastName=:lastString) OR (lastName=:firstString AND firstName=:lastString))';
    } else if (firstString && !lastString) {
      query = 'SELECT CONCAT(firstName, " ", lastName) as fullName, id FROM accounts WHERE firstName=:firstString OR lastName=:firstString';
    } else if (lastString && !firstString) {
      query = 'SELECT CONCAT(firstName, " ", lastName) as fullName, id FROM accounts WHERE lastName=:lastString OR firstName=:lastString';
    }
    if (query) {
      const [result] = await this.pool.query<IAccountRow[]>(query, {firstString, lastString});
      if (result.length === 0) return null;
      return result;
    } else {return null;}

  }
  async isExist(email: string): Promise<boolean> {
    const [result] = await this.pool.query<RowDataPacket[]>('SELECT 1 FROM accounts WHERE email=:email', {email});
    return result.length > 0;
  }
  async insert(data: IAccountInsertDTO): Promise<boolean> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      'INSERT INTO accounts (email,password,birthdayDate,firstName,lastName) VALUES (:email,:password,:birthdayDate,:firstName,:lastName)',
      {...data},
    );
    return result.affectedRows > 0;
  }
  async update(data: IAccountUpdateDTO): Promise<boolean> {
    const allowedKeys: (keyof IAccountUpdateDTO)[] = ['password', 'birthdayDate', 'firstName', 'lastName'];
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
    const [result] = await this.pool.execute<ResultSetHeader>(
      `UPDATE accounts SET ${fullQueryPart} WHERE email=:email`,
      queryValues as Record<keyof IAccountUpdateDTO | 'email', ExecuteValues>,
    );
    return result.affectedRows > 0;
  }
  async delete(email: string): Promise<boolean> {
    const [result] = await this.pool.execute<ResultSetHeader>('DELETE FROM accounts WHERE email=:email', {email: email});
    return result.affectedRows > 0;
  }
}
