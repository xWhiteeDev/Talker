import type {NextFunction, Request, Response} from "express";
import {ErrorHandler} from '../../handlers/errorHandler.js';

export function validateOtherUser() {
    return async (req: Request, _res: Response, next: NextFunction) => {
        const otherId: number = Number(req.body.data.otherId);
        if (isNaN(otherId)) {
            next(new ErrorHandler('The otherId param is not a number!', 400));
            return ;
        }
        next();
        return 
    };

}