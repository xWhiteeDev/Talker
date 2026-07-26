import express from 'express';
import {isAccessTokenActive} from '../../middleware/middleware.js';
import {commmentsController} from '../../loader/dependencyLoader.js';

export const commmentRouter = express.Router();


commmentRouter.post('/', isAccessTokenActive(), async (req, res, next) => {
    await commmentsController.insertComment(req, res, next);
});