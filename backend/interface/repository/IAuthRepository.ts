import type { IAccountRow } from "../database/IAccount.js";

export interface IAuthRepository {
    findByEmail(email: string): Promise<IAccountRow | null>;
    insert(email: string, password: string, birthdayDate: string, firstName: string, lastName: string): Promise<boolean>;
    update(email: string, dto: IUpdateDTO): Promise<boolean>
}
export interface IUpdateDTO {
    password?: string;
    birthdayDate?: string;
    firstName?: string;
    lastName?: string
}