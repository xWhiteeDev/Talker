import type { NextFunction, Request,Response } from "express";

export interface IAuthController {
    createUser(req: Request, res: Response, next: NextFunction): Promise<boolean>;
    signIn(req: Request, res: Response, next: NextFunction):Promise<boolean>
}