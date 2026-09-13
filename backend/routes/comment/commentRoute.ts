import express from 'express';
import {isAccessTokenActive, isDataValid} from '../../middleware/middleware.js';
import {commmentsController} from '../../loader/dependencyLoader.js';
import type {IObjectRequirements} from '../../services/types.js';

export const commmentRouter = express.Router();
const commentConfig:IObjectRequirements = {
    postId: {
        type:'number',
        requirements:{
            canBeNull:false,
        }
    },
    parentId: {
        type:'number',
        requirements:{
            canBeNull:true
        }
    },
    content: {
        type:'string',
        requirements:{
            canBeNull:false,
            minLength:3,
            maxLength:200
        }
    }

}
commmentRouter.post('/', isAccessTokenActive(),isDataValid(commentConfig), async (req, res, next) => {
    await commmentsController.insertComment(req, res, next);
});

commmentRouter.get('/:id', isAccessTokenActive(), async (req, res, next) => {
    await commmentsController.findByPostId(req,res,next)
});