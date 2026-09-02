import { ErrorHandler } from '../../handlers/errorHandler.js';
import type { IAccountRow, IAccountService } from '../Account/types.js';
import type { ISearchService } from './types.js';

class SearchService implements ISearchService {
  constructor(private accountService: IAccountService) {}
  async get(firstText: string, lastText: string):Promise<IAccountRow[] | null> {
    try {
      if (
        !firstText ||
        typeof firstText !== 'string' ||
        firstText.trim().length == 0 ||
        !lastText ||
        typeof lastText !== 'string' ||
        lastText.trim().length == 0
      ) {
        new ErrorHandler('First text or last Text not provided', 400);
        return null;
      }
      const result = await this.accountService.findUserByCriteria(firstText, lastText);
      if (!result) {
        new ErrorHandler('Result not fount', 404);
        return null;
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}
export { SearchService };
