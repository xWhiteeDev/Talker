import express from 'express';
import {isRefreshTokenValid} from '../middleware/middleware.js';


export const postRouter = express.Router();

postRouter.post('/', isRefreshTokenValid(), (req, res, next) => {
    console.log(req.body);
});