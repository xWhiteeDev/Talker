import type {RowDataPacket} from 'mysql2/promise';
import type {TExecutor} from '../../database/helper/transactionRunner.js';



export interface IAccountRepository {
  findWithCredentials(email: string): Promise<IAccountRow | null>;
  findById(id: number): Promise<IAccountRow | null>;
  insert(data: IAccountInsertDTO, executor: TExecutor): Promise<number>;
  update(data: IAccountUpdateDTO, executor: TExecutor): Promise<boolean>;
  delete(email: string, executor: TExecutor): Promise<boolean>;
  isExist(email: string): Promise<boolean>;

}

export interface IAccountService {
  findUserWithCredentials(email: string): Promise<IAccountRow | null>;
  findUserById(id: number): Promise<IAccountRow | null>;
  insertUser(document: IAccountInsertDTO, executor?: TExecutor): Promise<number | null>;
  updateUser(document: IAccountUpdateDTO, executor?: TExecutor): Promise<boolean>;
  deleteUser(email: string, executor?: TExecutor): Promise<boolean>;
  isUserExist(email: string): Promise<boolean>;
  markWelcomeSeen(email: string, state: boolean, executor?: TExecutor): Promise<boolean>;
}
export interface IAccountRow extends RowDataPacket {
  id: number;
  created_at: string;
  email: string;
  password: string;
  status: TVerification;
  welcome_seen: boolean;

}

export interface IAccountInsertDTO {
  email: string;
  password: string;
  status: TVerification;
}
export interface IAccountUpdateDTO extends Partial<IAccountInsertDTO> {
  welcome_seen?: boolean;
  email: string;
}

export interface ICurrentUser {
  id: number;
}

type TVerification = 'unverified' | 'verified' | 'suspended';