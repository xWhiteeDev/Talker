import {Router} from "express";
import {codeController} from "../../loader/dependencyLoader.js";

export const codeRouter = Router();

codeRouter.post('/verifyCode', async (req, res, next) => {
    await codeController.createCode(req,res,next);
});