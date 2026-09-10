import express from 'express';
import {validateOtherUser} from '../../dependencies/Friendship/friendshipMiddleware.js';
import {friendsController} from '../../loader/dependencyLoader.js';
import {isAccessTokenActive} from '../../middleware/middleware.js';

export const friendsRouter = express.Router();


friendsRouter.post('/invites', isAccessTokenActive(), validateOtherUser(), async (req, res, next) => {
    await friendsController.setRelation(req, res, next);
});

friendsRouter.patch('/invites', isAccessTokenActive(), validateOtherUser(), async (req, res, next) => {
    await friendsController.acceptRelation(req, res, next);
});
friendsRouter.delete('/invites', isAccessTokenActive(), validateOtherUser(), async (req, res, next) => {
    await friendsController.removeRelation(req, res, next);
});
friendsRouter.get('/invites/:otherid', isAccessTokenActive(), validateOtherUser(), async (req, res, next) => {
    await friendsController.areInRelation(req, res, next);
});