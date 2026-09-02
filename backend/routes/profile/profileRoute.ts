import { Router, type NextFunction, type Request, type Response } from 'express';
import { isAccessTokenActive } from '../../middleware/middleware.js';
import {profileController} from '../../loader/dependencyLoader.js';

export const profileRouter = Router();

profileRouter.get('/me', isAccessTokenActive(), async (req: Request, res: Response, next: NextFunction) => {
    await profileController.getMe(req,res,next)
});

profileRouter.get('/:id', isAccessTokenActive(), async (req: Request, res: Response, next: NextFunction) => {
    await profileController.getUser(req,res,next)
});
