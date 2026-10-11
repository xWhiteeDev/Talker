import type {RowDataPacket} from "mysql2";
import type {Response, Request, NextFunction} from "express";

export type TGender = 'female' | 'male' | 'Prefer not to say';

export interface IPersonal {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    birth_date: string ;
    living_place: string | null;
    gender: TGender;
}

export interface IPersonalRepository {
    getByUserId(userId: number): Promise<IPersonal | undefined>;
    insert(document: IPersonalInsertDTO): Promise<boolean>;
    update(userId: number, updateDocument: IPersonalUpdateDTO): Promise<boolean>;
    isAnyExist(userId: number): Promise<boolean>;
    delete(userId: number): Promise<boolean>;
}

export interface IPersonalService {
    getPersonal(userId: number): Promise<IPersonal | undefined>;
    insertPersonal(document: IPersonalInsertDTO): Promise<boolean>;
    updatePersonal(userId: number, updateDocument: IPersonalUpdateDTO): Promise<boolean>;
    deletePersonal(userId: number): Promise<boolean>;
}

export interface IPersonalController {
    getPersonal(req: Request, res: Response, next: NextFunction): Promise<void>;
    createPersonal(req: Request, res: Response, next: NextFunction): Promise<void>;
    updatePersonal(req: Request, res: Response, next: NextFunction): Promise<void>;
    deletePersonal(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IPersonalRow extends IPersonal, RowDataPacket {

}

export interface IPersonalInsertDTO
    extends Pick<IPersonal, 'user_id' | 'first_name' | 'last_name'>,
    Partial<Pick<IPersonal, 'birth_date' | 'living_place' | 'gender'>> {
}

export interface IPersonalUpdateDTO
    extends Partial<Pick<IPersonal, 'first_name' | 'last_name' | 'birth_date' | 'living_place' | 'gender'>> {
}