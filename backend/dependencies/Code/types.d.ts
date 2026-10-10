import type {RowDataPacket} from "mysql2";
import type {Response, Request, NextFunction} from "express";
export type TCodeType = 'verification' | 'forgotten_password';
export interface ICode {
    email: string;
    type: TCodeType;
    code: string;
    expiresAt: number;
    attempts: number;
}
export interface ICodeRepository {
    get(email: string, type: TCodeType): Promise<ICode | undefined>;
    getAllFor(email: string): Promise<ICode[] | undefined>;
    insert(document: ICodeInsertDTO): Promise<boolean>;
    update(email: string, type: TCodeType, updateDocument: ICodeUpdateDTO): Promise<boolean>;
    isAnyExist(email: string, type: TCodeType): Promise<boolean>;
    delete(email: string, type: TCodeType): Promise<boolean>;

}
export interface ICodeService {
    getCodeRow(email: string, type: TCodeType): Promise<ICode | undefined>;
    getAllCodesFor(email: string): Promise<ICode[] | undefined>;
    insertCode(document: ICodeInsertDTO): Promise<boolean>;
    updateCode(email: string, type: TCodeType, updateDocument: ICodeUpdateDTO): Promise<boolean>;
    deleteCode(email: string, type: TCodeType): Promise<boolean>;
    isCodeValid(email: string, type: TCodeType, code: string): Promise<boolean>;
}
export interface ICodeController {
    createCode(req: Request, res: Response, next: NextFunction): Promise<boolean>;
    deleteCode(req: Request, res: Response, next: NextFunction): boolean;
    confirmCode(req: Request, res: Response, next: NextFunction): Promise<boolean>;
}
export interface IServerCodeData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthdayDate: string;
}

export interface IServerConfirmationCodeData extends IServerCodeData {
    code: string;
}

export interface ICodeRow extends ICode, RowDataPacket {

}
export interface ICodeInsertDTO extends Exclude<ICode, 'attempts'> {
 }
export interface ICodeUpdateDTO extends Partial<Pick<ICode, 'code' | 'expiresAt' | 'attempts'>> { }
