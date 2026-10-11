import type {Request, Response, NextFunction} from "express";
import type {ICodeController, ICodeService,  IServerConfirmationCodeData, IServerResendData} from "./types.js";
import {config} from "dotenv";
import {ErrorHandler} from "../../handlers/errorHandler.js";

config();

export class CodeController implements ICodeController {
    constructor(private codeService: ICodeService) { }
    async resendVerificationCode(req: Request, res: Response, next: NextFunction): Promise<boolean> {
        try {
            const data: IServerResendData = req.body;
            //validation in route as middleware
            const resentResult = await this.codeService.resendCode(data.email, 'verification');
            if (resentResult) {
                res.status(200).json({success: true, message: 'Confirmation e-mail has been sent!'});
                return true;
            } else {
                throw new ErrorHandler('Failed to sent new confirmation e-mail', 500);
            }
        } catch (error) {
            if (error instanceof ErrorHandler) {
                res.status(error.code).json({success: false, message: error.message});
            } else {
                res.status(500).json({success: false, message: 'Unknown server error'});
            }
            next(error);
            return false;
        }
    }
    async confirmCode(req: Request, res: Response, next: NextFunction): Promise<boolean> {
        try {
            const data: IServerConfirmationCodeData = req.body;
            const email = data.email.trim().toLowerCase();
            const result = await this.codeService.confirmCode(email, 'verification', data.code);
            if (result) {
                res.status(200).json({success: true, message: 'Account confirmed'});
                return true;
            } else {
                throw new ErrorHandler('Code cannot be confirmed, try again later!', 400);
            }

        } catch (error) {
            if (error instanceof ErrorHandler) {
                res.status(error.code).json({success: false, message: error.message});
            } else {
                res.status(500).json({success: false, message: 'Unknown server error'});
            }
            return false;
        }
    }
   
}