import {Router, type Request,type Response,type NextFunction} from "express";
import {isAccessTokenActive} from "../../middleware/middleware.js";
import {searchController} from "../../loader/dependencyLoader.js";

export const searchRouter = Router()

searchRouter.get('/', isAccessTokenActive(), async (req:Request,res:Response,next:NextFunction)=> {
    await searchController.getByCriteria(req,res,next)
})