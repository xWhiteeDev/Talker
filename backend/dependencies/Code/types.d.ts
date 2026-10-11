import type {RowDataPacket} from "mysql2";
import type {Response, Request, NextFunction} from "express";
import type {IPersonal, TGender} from "../Personal/types.js";
export type TCodeType = 'verification' | 'forgotten_password';
export interface ICode {
    email: string;
    type: TCodeType;
    code: string;
    expires_at: number;
    attempts: number;
}
export interface ICodeRepository {
    get(email: string, type: TCodeType): Promise<ICode | undefined>;
    getAllFor(email: string): Promise<ICode[] | undefined>;
    insert(document: ICodeInsertDTO): Promise<boolean>;
    update(email: string, type: TCodeType, updateDocument: ICodeUpdateDTO): Promise<boolean>;
    isAnyExist(email: string, type: TCodeType): Promise<boolean>;
    reserveAttempt(email: string, type: TCodeType): Promise<boolean>;
    deleteWhenExhausted(email: string, type: TCodeType): Promise<boolean>;
    delete(email: string, type: TCodeType): Promise<boolean>;

}
export interface ICodeService {
    getCodeRow(email: string, type: TCodeType): Promise<ICode | undefined>;
    getAllCodesFor(email: string): Promise<ICode[] | undefined>;
    insertCode(document: ICodeInsertDTO): Promise<boolean>;
    updateCode(email: string, type: TCodeType, updateDocument: ICodeUpdateDTO): Promise<boolean>;
    deleteCode(email: string, type: TCodeType): Promise<boolean>;
    isCodeValid(email: string, type: TCodeType, code: string): Promise<boolean>;
    resendCode(email: string, type: TCodeType): Promise<boolean>;
    confirmCode(email: string, type: TCodeType, code: string): Promise<boolean>;
}
export interface ICodeController {
    resendVerificationCode(req: Request, res: Response, next: NextFunction): Promise<boolean>;
    confirmCode(req: Request, res: Response, next: NextFunction): Promise<boolean>;
}
export interface IServerPersonalData {
    firstName: string;
    lastName: string;
    livingPlace: string;
    gender: TGender;
    birthdayDate: string;
}
export interface IServerResendData {
    email: string;
}
export interface IServerConfirmationCodeData {
    email: string;
    code: string;
}

export interface ICodeRow extends ICode, RowDataPacket {

}
export interface ICodeInsertDTO extends Exclude<ICode, 'attempts'> {
}
export interface ICodeUpdateDTO extends Partial<Pick<ICode, 'code' | 'expires_at' | 'attempts'>> { }
