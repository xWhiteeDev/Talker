import express from 'express';
import {validateOtherUser} from '../../dependencies/Friendship/friendshipMiddleware.js';
import {friendsController} from '../../loader/dependencyLoader.js';
import {isAccessTokenActive} from '../../middleware/middleware.js';

export const router = express.Router();


router.post('/invites', isAccessTokenActive(), validateOtherUser(), async (req, res, next) => {
    await friendsController.setRelation(req, res, next);
});

router.patch('/invites', isAccessTokenActive(), validateOtherUser(), async (req, res, next) => {
    await friendsController.acceptRelation(req, res, next);
});
router.delete('/invites', isAccessTokenActive(), validateOtherUser(), async (req, res, next) => {
    await friendsController.removeRelation(req, res, next);
});
router.get('/invites', isAccessTokenActive(), validateOtherUser(), async (req, res, next) => {
    await friendsController.areInRelation(req, res, next);
});