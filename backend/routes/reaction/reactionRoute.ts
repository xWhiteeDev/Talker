import express from 'express';
import {isRefreshTokenValid} from '../../middleware/middleware.js';
import {postReactionController} from '../../loader/dependencyLoader.js';

export const postReactionRouter = express.Router();


postReactionRouter.post('/', isRefreshTokenValid(), async (req, res, next) => {
    await postReactionController.createReaction(req, res, next);
});

postReactionRouter.delete('/', isRefreshTokenValid(), async (req, res, next) => {
    await postReactionController.deleteReaction(req, res, next);
});