import express from 'express';
import {isAccessTokenActive} from '../../middleware/middleware.js';
import {postController} from '../../loader/dependencyLoader.js';


export const postRouter = express.Router();

postRouter.post('/', isAccessTokenActive(), async (req, res, next) => {
    await postController.insertNewPost(req, res, next);
});

postRouter.get('/', isAccessTokenActive(), async (req, res, next) => {
    await postController.fetchLatestPosts(req, res, next);
});
postRouter.get('/:id', isAccessTokenActive(), async (req, res, next) => {
    await postController.getSpecifiedPost(req, res, next);
});