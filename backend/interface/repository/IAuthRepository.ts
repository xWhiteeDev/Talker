import type { IAccountRow } from "../database/IAccount.js";

export interface IAuthRepository {
    findByEmail(email: string): Promise<IAccountRow | null>;
    insert( data:IAuthInsertDTO): Promise<boolean>;
    update(data: IAuthUpdateDTO): Promise<boolean>;
    delete(email:string):Promise<boolean>
}
export interface IAuthInsertDTO {
    email:string
    password: string;
    birthdayDate: string;
    firstName: string;
    lastName: string
}
export interface IAuthUpdateDTO extends Partial<IAuthInsertDTO> {
    email:string
}