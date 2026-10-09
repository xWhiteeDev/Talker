import bcrypt from "bcryptjs";
import type {ICode, ICodeInsertDTO, ICodeRepository, ICodeService, ICodeUpdateDTO, TCodeType} from "./types.js";
import {config} from "dotenv";
config();
export class CodeService implements ICodeService {
    constructor(private codeRepository: ICodeRepository) {

    }
    async getCodeRow(email: string, type: TCodeType): Promise<ICode | undefined> {
        const result = await this.codeRepository.get(email, type);
        return result;
    }
    async getAllCodesFor(email: string): Promise<ICode[] | undefined> {
        const result = await this.codeRepository.getAllFor(email);
        return result;
    }
    async insertCode(document: ICodeInsertDTO): Promise<boolean> {
        const existingCode: boolean = await this.codeRepository.isAnyExist(document.email, document.type);
        if (existingCode) {
            await this.updateCode(document.email, document.type, {
                code: document.code, attempts: 0, expiresAt: document.expiresAt,
            });
            return true;
        }
        const hashedCode = await bcrypt.hash(document.code, 12);

        const result = await this.codeRepository.insert({...document, code: hashedCode, });
        return result;
    }
    async isCodeValid(email: string, type: TCodeType, code: string): Promise<boolean> {
        const existingRow = await this.codeRepository.get(email, type);
        if (!existingRow) return false;
        const attempts: number = existingRow.attempts;
        const max_attempts = parseInt(process.env['TALKER_SERVER_CODE_MAX_ATTEMPTS'] ?? '5');
        if (Date.now() >= existingRow.expiresAt || attempts >= max_attempts) {
            await this.codeRepository.delete(email, type);
            return false;
        }
        const isCodeCorrect = await bcrypt.compare(code, existingRow.code);
        if (!isCodeCorrect) {
            const incrementedAttempts = attempts + 1;
            await this.codeRepository.update(email, type, {attempts: incrementedAttempts});
            return false;
        }
        return await this.codeRepository.delete(email, type);
    }
    async updateCode(email: string, type: TCodeType, updateDocument: ICodeUpdateDTO): Promise<boolean> {
        const existingCode: boolean = await this.codeRepository.isAnyExist(email, type);
        if (!existingCode || !updateDocument.code) {
            return false;
        }
        const hashedCode = await bcrypt.hash(updateDocument.code, 12);
        const result = await this.codeRepository.update(email, type, {...updateDocument, code: hashedCode});
        return result;
    }
    async deleteCode(email: string, type: TCodeType): Promise<boolean> {
        const existingCode: boolean = await this.codeRepository.isAnyExist(email, type);
        if (!existingCode) {
            return false;
        }
        const result = await this.codeRepository.delete(email, type);
        return result;
    }

}