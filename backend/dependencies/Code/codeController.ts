import type {Request, Response, NextFunction} from "express";
import type {ICodeController, ICodeService, IServerCodeData, IServerConfirmationCodeData} from "./types.js";
import {generateRandomCode} from "../../helpers/char.js";
import {config} from "dotenv";
import {ErrorHandler} from "../../handlers/errorHandler.js";
import type {IResend} from "../../services/Resend/type.js";
import {confirmationEmail} from "../../services/Resend/templates/email.template.js";
import type {IAccountService} from "../Account/types.js";

config();

export class CodeController implements ICodeController {
    constructor(private codeService: ICodeService, private Emailer: IResend, private accountService: IAccountService) { }
    async createCode(req: Request, res: Response, next: NextFunction): Promise<boolean> {

        try {
            const data: IServerCodeData = req.body;
            const generatedCode = generateRandomCode(parseInt(process.env['TALKER_SERVER_CODE_MAX_LENGTH'] ?? '6'));
            if (generatedCode.trim().length === 0) {
                throw new ErrorHandler('Code generating error', 500);
            }
            const confirmation = confirmationEmail(generatedCode, 5);
            const result = await this.Emailer.send(confirmation.subject, confirmation.html, confirmation.text, data.email.trim().toLocaleLowerCase());
            if (result) {
                const isCodeInserted: boolean = await this.codeService.insertCode({email: data.email, code: generatedCode, type: 'verification', expiresAt: Date.now() + 5 * 60_000, attempts: 0});
                const isAccountExist = !!(await this.accountService.findUserWithCredentials(data.email))
                if (isCodeInserted && !isAccountExist) {
                    await this.accountService.insertUser({
                        email: data.email,
                        password: data.password,
                        birthdayDate: data.birthdayDate,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        status:'unverified'
                    });
                }
            }
            res.status(200).json({message: 'Confirmation e-mail sent!', data: result});
            return result;
        } catch (error) {
            if (error instanceof ErrorHandler) {
                res.status(error.code).json({message: error.message, data: false});
            } else {
                res.status(500).json({message: 'Unknown server error'});
            }
            next(error);
            return false;
        }
    }
    async confirmCode(req: Request, res: Response, next: NextFunction): Promise<boolean> {
        try {
            const data: IServerConfirmationCodeData = req.body;
            const existingCode = await this.codeService.isCodeValid(data.email, 'verification', data.code);
            console.log(`${existingCode} - Existing code result`);
            if (!existingCode) {
                throw new ErrorHandler('Code not valid', 400);
            }
            res.status(200).json({message: 'Account confirmed', data: true});
            return true;

        } catch (error) {
            if (error instanceof ErrorHandler) {
                res.status(error.code).json({message: error.message, data: false});
            } else {
                res.status(500).json({message: 'Unknown server error', data: false});
            }
            return false;
        }
    }
    deleteCode(req: Request, res: Response, next: NextFunction): boolean {
        try {
            return true;
        } catch (error) {
            return false;
        }
    }
}