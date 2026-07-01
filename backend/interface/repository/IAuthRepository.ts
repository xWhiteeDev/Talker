import type { IAccountRow } from "../database/IAccount.js";

export interface IAccountRepository {
    findWithCredentials(email: string): Promise<IAccountRow | null>;
    insert( data:IAccountInsertDTO): Promise<boolean>;
    update(data: IAccountUpdateDTO): Promise<boolean>;
    delete(email:string):Promise<boolean>;
    isExist(email: string): Promise<boolean>
}
export interface IAccountInsertDTO {
    email:string
    password: string;
    birthdayDate: string;
    firstName: string;
    lastName: string
}
export interface IAccountUpdateDTO extends Partial<IAccountInsertDTO> {
    email:string
}