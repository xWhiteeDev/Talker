import type { IAccountRow } from "../database/IAccount.js";
import type { IAccountInsertDTO, IAccountUpdateDTO } from "../repository/IAccountRepository.js";

export interface IAccountService {
    findUserWithCredentials(email: string): Promise<IAccountRow | null>;
    insertUser(document: IAccountInsertDTO): Promise<boolean>;
    updateUser(document: IAccountUpdateDTO): Promise<boolean>
    deleteUser(email: string): Promise<boolean>;
    isUserExist(email: string): Promise<boolean>
}

export interface IUser {
    id:number;
    access:string;
    refresh:string;
}