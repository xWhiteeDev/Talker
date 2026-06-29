import type { IAccountRow } from "../database/IAccount.js";
import type { IAuthInsertDTO, IAuthUpdateDTO } from "../repository/IAuthRepository.js";

export interface IAuthService {
    findByEmail(email: string): Promise<IAccountRow | null>;
    insert(data: IAuthInsertDTO): Promise<boolean>;
    update(dto: IAuthUpdateDTO): Promise<boolean>
    delete(email: string): Promise<boolean>
}