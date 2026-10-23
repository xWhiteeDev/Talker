import bcrypt from "bcryptjs";
import type {ICode, ICodeInsertDTO, ICodeRepository, ICodeService, ICodeUpdateDTO, TCodeType} from "./types.js";
import {config} from "dotenv";
import type {IResend} from "../../services/Resend/type.js";
import {generateRandomCode} from "../../helpers/char.js";
import {ACCOUNT_CONFIG} from "../../configurations/account.config.js";
import {confirmationEmail} from "../../services/Resend/templates/email.template.js";
import type {IAccountService} from "../Account/types.js";
import type {TExecutor} from "../../database/helper/transactionRunner.js";
config();
export class CodeService implements ICodeService {
    constructor(private codeRepository: ICodeRepository, private accountService: IAccountService, private Emailer: IResend) {

    }

    async getCodeRow(email: string, type: TCodeType): Promise<ICode | undefined> {
        const result = await this.codeRepository.get(email, type);
        return result;
    }
    async getAllCodesFor(email: string): Promise<ICode[] | undefined> {
        const result = await this.codeRepository.getAllFor(email);
        return result;
    }
    async insertCode(document: ICodeInsertDTO, executor?: TExecutor): Promise<boolean> {
        const existingCode: boolean = await this.codeRepository.isAnyExist(document.email, document.type);
        if (existingCode) {
            await this.updateCode(document.email, document.type, {
                code: document.code, attempts: 0, expires_at: document.expires_at,
            }, executor);
            return true;
        }
        const hashedCode = await bcrypt.hash(document.code, 12);
        const result = await this.codeRepository.insert({...document, code: hashedCode}, executor);
        return result;
    }
    async isCodeValid(email: string, type: TCodeType, code: string): Promise<boolean> {
        const existingRow = await this.codeRepository.get(email, type);
        if (!existingRow) return false;
        if (Date.now() >= existingRow.expires_at) {
            await this.codeRepository.deleteWhenExhausted(email, type);
            return false;
        }
        const hasFreeAttempts: boolean = await this.codeRepository.reserveAttempt(email, type);
        if (!hasFreeAttempts) {
            await this.codeRepository.deleteWhenExhausted(email, type);
            return false;
        }
        const isCodeCorrect = await bcrypt.compare(code, existingRow.code);
        if (!isCodeCorrect) {
            await this.codeRepository.deleteWhenExhausted(email, type);
            return false
        }
        return await this.codeRepository.delete(email, type);
    }
    async updateCode(email: string, type: TCodeType, updateDocument: ICodeUpdateDTO, executor?: TExecutor): Promise<boolean> {
        const existingCode: boolean = await this.codeRepository.isAnyExist(email, type);
        if (!existingCode || !updateDocument.code) {
            return false;
        }
        const hashedCode = await bcrypt.hash(updateDocument.code, 12);
        const result = await this.codeRepository.update(email, type, {...updateDocument, code: hashedCode}, executor);
        return result;
    }

    async deleteCode(email: string, type: TCodeType, executor?: TExecutor): Promise<boolean> {
        const existingCode: boolean = await this.codeRepository.isAnyExist(email, type);
        if (!existingCode) {
            return false;
        }
        const result = await this.codeRepository.delete(email, type, executor);
        return result;
    }
    async resendCode(email: string, type: TCodeType): Promise<boolean> {
        const isCodeExist = await this.getCodeRow(email, type);
        if (isCodeExist) {
            await this.deleteCode(email, type);
        }

        const generatedCode: string = generateRandomCode(ACCOUNT_CONFIG.CODE.MAX);
        await this.insertCode({email: email, type: 'verification', code: generatedCode, expires_at: Date.now() + 5 * 60_000, attempts: 0});
        const confirmEmail = confirmationEmail(generatedCode, 5);
        const sentResult = await this.Emailer.send(confirmEmail.subject, confirmEmail.html, confirmEmail.text, email);
        return sentResult;
    }
    async confirmCode(email: string, type: TCodeType, code: string): Promise<boolean> {
        const codeValid = await this.isCodeValid(email, type, code);
        if (!codeValid) return false;
        await this.accountService.updateUser({email: email, status: 'verified'});
        return true;
    }

}