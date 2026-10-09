import type {Request, Response, NextFunction} from "express";
import type {ICodeController, ICodeInsertDTO, ICodeService, IServerCodeData, IServerConfirmationCodeData} from "./types.js";
import {generateRandomCode} from "../../helpers/char.js";
import {config} from "dotenv";
import {ErrorHandler} from "../../handlers/errorHandler.js";
import type {IResend} from "../../services/Resend/type.js";
import {confirmationEmail} from "../../services/Resend/templates/email.template.js";

config();

export class CodeController implements ICodeController {
    constructor(private codeService: ICodeService, private Emailer: IResend) { }
    async createCode(req: Request, res: Response, next: NextFunction): Promise<boolean> {

        try {
            const data: IServerCodeData = req.body;
            console.log(`Received email: ${data.email}`);

            const generatedCode = generateRandomCode(parseInt(process.env['TALKER_SERVER_CODE_MAX_LENGTH'] ?? '6'));
            if (generatedCode.trim().length === 0) {
                throw new ErrorHandler('Code generating error', 500);
            }
            const confirmation = confirmationEmail(generatedCode, 5);
            const result = await this.Emailer.send(confirmation.subject, confirmation.html, confirmation.text, data.email);
            if (result) {
                this.codeService.insertCode({email: data.email, code: generatedCode, type: 'verification', expiresAt: Date.now() + 5 * 60_000});
            }
            res.status(200).json({message: 'Confirmation e-mail sent!', data: result});
            return result;
        } catch (error) {
            if (error instanceof ErrorHandler) {
                res.status(error.code).json({message: error.message, data: false});
            } else {
                res.status(500).json({message: 'Unknown server error'});
                console.log(error);
            }

            return false;
        }
    }
    async confirmCode(req: Request, res: Response, next: NextFunction): Promise<boolean> {
        try {
            const data: IServerConfirmationCodeData = req.body;
            const existingCode = await this.codeService.isCodeValid(data.email, 'verification', data.code);
            if (!existingCode) {
                throw new ErrorHandler('Code not valid', 400);
            }
            res.status(200).json({message:'Account confirmed',data:true})

        } catch (error) {
            if (error instanceof ErrorHandler) {
                res.status(error.code).json({message: error.message, data: false});
            } else {
                res.status(500).json({message: 'Unknown server error', data: false});
            }

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