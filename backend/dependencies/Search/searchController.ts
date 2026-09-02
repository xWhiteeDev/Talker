import type { Request, Response, NextFunction } from 'express';
import type { ISearchController, ISearchService } from './types.js';
import type { currentUser } from '../Account/types.js';
import { ErrorHandler } from '../../handlers/errorHandler.js';

class SearchController implements ISearchController {
  constructor(private searchService: ISearchService) {}
  async getByCriteria(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    try {
      const user: currentUser = req.currentUser;
      const params = req.query['criteria'] as string;
      if (!user || user.id == undefined || typeof user.id !== 'number') {
        new ErrorHandler('Unauthorized', 401);
        next('Unauthorized');
        return false;
      }
      if (!params || typeof params !== 'string' || params.trim().length === 0) {
        new ErrorHandler('Parameters fault', 400);
        return false;
      }
      const [firstString, lastString] = params.split(' ');
      const result = await this.searchService.get(firstString, lastString);
      if (result && result.length === 0) {
        res.status(201).json({ success: true, data: undefined });
        return false;
      }
      res.status(201).json({ success: true, data: result });
      return true;
    } catch (error) {
      if (error instanceof ErrorHandler) {
        res.status(error.code).json({ success: false, data: error.message });
      }
      next(error);
      throw error;
    }
  }
}
export { SearchController };
