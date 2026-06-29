import type { IAccountRow } from "../database/IAccount.js";

export interface IAuthRepository {
    findByEmail(email: string): Promise<IAccountRow | null>;
    insert(email: string, data:IAuthInsertDTO): Promise<boolean>;
    update(email: string, dto: IAuthUpdateDTO): Promise<boolean>;
    delete(email:string):Promise<boolean>
}
export interface IAuthInsertDTO {
    password: string;
    birthdayDate: string;
    firstName: string;
    lastName: string
}
export interface IAuthUpdateDTO extends Partial<IAuthInsertDTO> {}