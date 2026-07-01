import type { IAccountService } from "../../interface/service/IAuthService.js";
import type { NextFunction, Request, Response } from "express";
export class AuthController {
    constructor(private accountService: IAccountService) {
        console.log(`\x1b[32;1m🚀[authController] AccountService injected \x1b[0m`)
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.accountService.insertUser(req.body.data)
            if (!result) {
                res.status(400).json({ message: "Failed to insert result" })
                return false
            }
            res.status(200).json({ message: 'Record added!' });
            return true
        } catch (error) {
            next(error)
        }
    }
}