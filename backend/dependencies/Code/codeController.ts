import type {Request, Response, NextFunction} from "express";
import type {ICodeController, ICodeInsertDTO, ICodeService} from "./types.js";
import {generateRandomCode} from "../../helpers/char.js";
import {config} from "dotenv";
import {ErrorHandler} from "../../handlers/errorHandler.js";

config();

export class CodeController implements ICodeController {
    constructor(private codeService: ICodeService) { }
    async createCode(req: Request, res: Response, next: NextFunction): Promise<boolean> {
        try {
            const data = req.body.data
            const generatedCode = generateRandomCode(parseInt(process.env['TALKER_SERVER_CODE_MAX_LENGTH'] ?? '6'));
            if (generatedCode.trim().length === 0) {
                throw new ErrorHandler('Code generating error', 500);
            }
            return true;
        } catch (error) {
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