import type {RowDataPacket} from "mysql2";
import type {Response, Request, NextFunction} from "express";
export type TCodeType = 'verification' | 'forgotten_password';
export interface ICodeRow extends RowDataPacket {
    email: string;
    type: TCodeType;
    code: string;
    expiresAt: number;
}
export interface ICodeInsertDTO extends ICodeRow { }
export interface ICodeUpdateDTO extends Pick<ICodeRow, 'code' | 'expiresAt'> { }

export interface ICodeRepository {
    get(email: string, type: TCodeType): Promise<ICodeRow | undefined>;
    getAllFor(email: string): Promise<ICodeRow[] | undefined>;
    insert(document: ICodeInsertDTO): Promise<boolean>;
    update(email: string, type: TCodeType, updateDocument: ICodeUpdateDTO): Promise<boolean>;
    delete(email: string, type: TCodeType): Promise<boolean>;

}
export interface ICodeService {
    getCode(email: string, type: TCodeType): Promise<ICodeRow | undefined>;
    getAllCodesFor(email: string): Promise<ICodeRow[] | undefined>;
    insertCode(document: ICodeInsertDTO): Promise<boolean>;
    updateCode(email: string, type: TCodeType, updateDocument: ICodeUpdateDTO): Promise<boolean>;
    deleteCode(email: string, type: TCodeType): Promise<boolean>;
}
export interface ICodeController {
    createCode(req: Request, res: Response, next: NextFunction): boolean;
    deleteCode(req: Request, res: Response, next: NextFunction): boolean;
}