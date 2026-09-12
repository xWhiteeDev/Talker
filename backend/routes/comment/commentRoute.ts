import express from 'express';
import {isAccessTokenActive, isDataValid} from '../../middleware/middleware.js';
import {commmentsController} from '../../loader/dependencyLoader.js';
import type {IObjectRequirements} from '../../services/types.js';

export const commmentRouter = express.Router();
const commentConfig:IObjectRequirements = {

}
//TODO Tomorrow: Remember parentId will be sometimes null!
commmentRouter.post('/',isDataValid(commentConfig), isAccessTokenActive(), async (req, res, next) => {
    await commmentsController.insertComment(req, res, next);
});

commmentRouter.get('/:id', isAccessTokenActive(), async (req, res, next) => {
    await commmentsController.findByPostId(req,res,next)
});