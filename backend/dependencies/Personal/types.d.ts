import type {RowDataPacket} from "mysql2";
import type {Response, Request, NextFunction} from "express";

export type TGender = 'female' | 'male' | 'Prefer not to say';

export interface IPersonalRow extends RowDataPacket {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    birth_date: string ;
    living_place: string | null;
    gender: TGender;
}

export interface IPersonal {
    id:number;
    userId:number;
    firstName:string;
    lastName:string;
    birthDate:string;
    livingPlace:string | null;
    gender:TGender
}
export interface IPersonalRepository {
    getByUserId(userId: number): Promise<IPersonalRow | null>;
    insert(document: IPersonalRowInsertDTO): Promise<boolean>;
    update(userId: number, updateDocument: IPersonalpdateDTO): Promise<boolean>;
    isAnyExist(userId: number): Promise<boolean>;
    delete(userId: number): Promise<boolean>;
}

export interface IPersonalService {
    getPersonal(userId: number): Promise<IPersonal | null>;
    insertPersonal(document: IPersonalRowInsertDTO): Promise<boolean>;
    updatePersonal(userId: number, updateDocument: IPersonalRowUpdateDTO): Promise<boolean>;
    deletePersonal(userId: number): Promise<boolean>;
}

export interface IPersonalController {
    getPersonal(req: Request, res: Response, next: NextFunction): Promise<void>;
    createPersonal(req: Request, res: Response, next: NextFunction): Promise<void>;
    updatePersonal(req: Request, res: Response, next: NextFunction): Promise<void>;
    deletePersonal(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IPersonalRowRow extends IPersonalRow, RowDataPacket {

}

export interface IPersonalInsertDTO
    extends Pick<IPersonalRow, 'user_id' | 'first_name' | 'last_name'>,
    Partial<Pick<IPersonalRow, 'birth_date' | 'living_place' | 'gender'>> {
}

export interface IPersonalUpdateDTO
    extends Partial<Pick<IPersonalRow, 'first_name' | 'last_name' | 'birth_date' | 'living_place' | 'gender'>> {
}