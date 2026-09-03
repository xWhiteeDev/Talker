import { ErrorHandler } from '../../handlers/errorHandler.js';
import type { IAccountService } from '../Account/types.js';
import type { PostService } from '../Post/postService.js';
import type { PostRow } from '../Post/types.js';
import type { IProfile, IProfileService } from './types.js';

class ProfileService implements IProfileService {
  constructor(
    private accountService: IAccountService,
    private postService: PostService,
  ) {}

  async get(userId: number, requestedId: number): Promise<IProfile> {
    try {
      if (userId == undefined) {
        throw new ErrorHandler('User ID not provided', 400);
      }
      if (typeof userId !== 'number') {
        throw new ErrorHandler('User ID must be a number', 400);
      }
      const accountProfileProperties =
        userId !== requestedId
          ? await this.accountService.findUserById(requestedId)
          : await this.accountService.findUserById(userId);

      if (!accountProfileProperties) {
        throw new ErrorHandler('Account not found', 404);
      }
      const content = await this.postService.findByAuthor(userId, requestedId);
      return {
        fullName: accountProfileProperties.firstName + ' ' + accountProfileProperties.lastName,
        birthdayDate: accountProfileProperties.birthdayDate,
        joinDate: accountProfileProperties.created_at,
        description: 'My hardcoded description',
        content: content,
      };
    } catch (error) {
      throw error;
    }
  }
}

export { ProfileService };
