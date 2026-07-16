import type {NextFunction, Request, Response} from "express";
import {configDotenv} from "dotenv";
import {ErrorHandler} from "../../handlers/errorHandler.js";
import type {IAuthController, IAuthService} from "./types.js";
import type {currentUser} from "../Account/types.js";


configDotenv();
export class AuthController implements IAuthController {
    constructor(private authService: IAuthService) {
        console.log(`\x1b[32;1m🚀[authController] AccountService injected \x1b[0m`);
    }
    async createUser(req: Request, res: Response, next: NextFunction): Promise<boolean> {
        try {
            const result = await this.authService.signUp(req.body.data);
            if (!result) {
                next();
                return false;
            }
            res.status(200).json({status: true, data: result});
            next();
            return true;
        } catch (error) {
            next(error);
        }
        return true;
    }
    async signIn(req: Request, res: Response, next: NextFunction): Promise<boolean> {
        try {
            const data = req.body.data;
            const signResult = await this.authService.signIn({
                email: data.email,
                password: data.password
            });
            if (!signResult) {
                next();
                return false;
            }
            res.cookie('accessToken', signResult.access, {
                httpOnly: true,
                sameSite: 'lax',
                secure: true,
                maxAge: 5 * 60 * 1000 //5 Minutes from now
            });
            res.cookie('refreshToken', signResult.refresh, {
                httpOnly: true,
                sameSite: 'lax',
                secure: true,
                maxAge: 60000 * 60 * 24 * 7 //7 Days from now
            });
            if (!req.currentUser) {
                req.currentUser = {} as currentUser;
            }
            req['currentUser'] = {id: signResult.id};
            res.status(200).json({success: true, data: {id: signResult.id}});
            next();
            return true;

        } catch (error) {
            next(error);

        }
        return true;
    }
    refreshToken(req: Request, res: Response, next: NextFunction) {
        if (!req.currentUser) {

            throw new ErrorHandler('Unauthorised!!!', 401, true);
        }
        const {id} = req.currentUser;
        const signedToken = this.authService.signNewToken(id, 'access');
        res.cookie('accessToken', signedToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            maxAge: 5 * 60 * 1000
        });
        res.status(200).json({success: true, data: {id}});
        next();
        return true;
    }
}