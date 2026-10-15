import type {RowDataPacket} from 'mysql2/promise';

export interface IAccountRepository {
  findWithCredentials(email: string): Promise<IAccountRow | null>;
  findById(id: number): Promise<IAccountRow | null>;
  insert(data: IAccountInsertDTO): Promise<number>;
  update(data: IAccountUpdateDTO): Promise<boolean>;
  delete(email: string): Promise<boolean>;
  isExist(email: string): Promise<boolean>;

}

export interface IAccountService {
  findUserWithCredentials(email: string): Promise<IAccountRow | null>;
  findUserById(id: number): Promise<IAccountRow | null>;
  insertUser(document: IAccountInsertDTO): Promise<number | null>;
  updateUser(document: IAccountUpdateDTO): Promise<boolean>;
  deleteUser(email: string): Promise<boolean>;
  isUserExist(email: string): Promise<boolean>;
  markWelcomeSeen(email: string, state: boolean): Promise<boolean>;
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