import type { NextFunction, Request, Response } from "express";
import type { IAuthService } from "../../interface/service/IAuthService.js";
import type { IAuthController } from "../../interface/controller/IAuthController.js";
export class AuthController implements IAuthController {
    constructor(private authService: IAuthService) {
        console.log(`\x1b[32;1m🚀[authController] AccountService injected \x1b[0m`)
    }
    async createUser(req: Request, res: Response, next: NextFunction): Promise<boolean> {
        try {
            const result = await this.authService.signUp(req.body.data)
            if (!result) {
                return false
            }
            res.status(200).json({ message: 'Record added!' });
            return true
        } catch (error) {
            next(error)
        }
        return true
    }
    async signIn(req: Request, res: Response, next: NextFunction): Promise<boolean> {
        try {
            const data = req.body.data
            const signResult = await this.authService.signIn({
                email: data.email,
                password: data.password
            });
            if (!signResult) {
                next()
                return false
            }
            res.cookie('token', signResult.token, {
                httpOnly: true,
                sameSite: true,
                secure: true
            })
            res.status(200).json({ id: signResult.id })
            return true

        } catch (error) {
            next(error)

        }
        return true
    }
}