import type { IAccountRow } from "../database/IAccount.js";
import type { IAuthInsertDTO, IAuthUpdateDTO } from "../repository/IAuthRepository.js";

export interface IAuthService {
    findByEmail(email: string): Promise<IAccountRow | null>;
    insert(email: string, data: IAuthInsertDTO): Promise<boolean>;
    update(email: string, dto: IAuthUpdateDTO): Promise<boolean>
    delete(email: string): Promise<boolean>
}