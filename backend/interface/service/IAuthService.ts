import type { IAccountRow } from "../database/IAccount.js";
import type { IAuthInsertDTO, IAuthUpdateDTO } from "../repository/IAuthRepository.js";

export interface IAuthService {
    findUserWithCredentials(email: string): Promise<IAccountRow | null>;
    insertUser(document: IAuthInsertDTO): Promise<boolean>;
    updateUser(document: IAuthUpdateDTO): Promise<boolean>
    deleteUser(email: string): Promise<boolean>;
    isUserExist(email: string): Promise<boolean>
}