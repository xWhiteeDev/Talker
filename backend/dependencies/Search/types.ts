import type {IAccountRow} from "../Account/types.js";
import type { Request,Response, NextFunction } from "express";
interface ISearchService {
    get(firstText: string, lastText: string):Promise<IAccountRow[] | null>
}
interface ISearchController {
    getByCriteria(req:Request,res:Response,next:NextFunction):Promise<boolean>
}
export type {ISearchService,ISearchController}