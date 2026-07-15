import type {NextFunction, Request, Response} from "express";
import {ErrorHandler} from '../../handlers/errorHandler.js';

export function validateOtherUser() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const otherUserId: number = Number(req.query['otherUserId']);
        if (isNaN(otherUserId)) {
            next(new ErrorHandler('The otherUserId param is not a number!', 400));
            return ;
        }
        req.otherUserId = otherUserId;
        next();
        return 
    };

}