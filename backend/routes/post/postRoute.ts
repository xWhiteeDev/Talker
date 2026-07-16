import express from 'express';
import {isRefreshTokenValid} from '../../middleware/middleware.js';
import {postController} from '../../loader/dependencyLoader.js';


export const postRouter = express.Router();

postRouter.post('/', isRefreshTokenValid(), async (req, res, next) => {
    await postController.insertNewPost(req, res, next);
});

postRouter.get('/', isRefreshTokenValid(), async (req, res, next) => {
    await postController.fetchLatestPosts(req, res, next);
});