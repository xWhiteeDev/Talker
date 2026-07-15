import type {RowDataPacket} from "mysql2/promise";

export interface IAccountRepository {
    findWithCredentials(email: string): Promise<IAccountRow | null>;
    insert(data: IAccountInsertDTO): Promise<boolean>;
    update(data: IAccountUpdateDTO): Promise<boolean>;
    delete(email: string): Promise<boolean>;
    isExist(email: string): Promise<boolean>;
}

export interface IAccountService {
    findUserWithCredentials(email: string): Promise<IAccountRow | null>;
    insertUser(document: IAccountInsertDTO): Promise<boolean>;
    updateUser(document: IAccountUpdateDTO): Promise<boolean>;
    deleteUser(email: string): Promise<boolean>;
    isUserExist(email: string): Promise<boolean>;
}
export interface IAccountRow extends RowDataPacket {
    id: string;
    created_at: string;
    email: string;
    password: string
}

export interface IUser {
    id: number;
    access: string;
    refresh: string;
}

export interface IAccountInsertDTO {
    email: string;
    password: string;
    birthdayDate: string;
    firstName: string;
    lastName: string;
}
export interface IAccountUpdateDTO extends Partial<IAccountInsertDTO> {
    email: string;
}


export interface currentUser {
    id:number;
}

