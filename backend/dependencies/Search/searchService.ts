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
      const result = null;
      console.log('Search service todo')
      if (!result) {
       throw new ErrorHandler('Result not found', 404);
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}
export { SearchService };
