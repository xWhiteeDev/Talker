import type { Request, Response, NextFunction } from 'express';
import type { ISearchController, ISearchService } from './types.js';
import type { currentUser } from '../Account/types.js';
import { ErrorHandler } from '../../handlers/errorHandler.js';

class SearchController implements ISearchController {
  constructor(private searchService: ISearchService) {}
  async getByCriteria(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    try {
      const user: currentUser | undefined = req.currentUser;
      if (!user) {
        throw new ErrorHandler('Unauthorised', 401)
      }
      const params = req.query['criteria'] as string;
      if (!user || user.id == undefined || typeof user.id !== 'number') {
        throw new ErrorHandler('Unauthorized', 401);
      }
      if (!params || typeof params !== 'string' || params.trim().length === 0) {
       throw new ErrorHandler('Parameters fault', 400);
      }
      const [firstString, lastString] = params.split(' ');
      if (!firstString || !lastString) {
        res.status(401).json({ success: false, data: undefined });
        return false;
      }
      const result = await this.searchService.get(firstString, lastString);
      if (result && result.length === 0) {
        res.status(201).json({ success: false, data: undefined });
        return false;
      }
      res.status(201).json({ success: true, data: result });
      return true;
    } catch (error) {
      next(error);
      return false
    }
  }
}
export { SearchController };
