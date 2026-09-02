import { ErrorHandler } from '../../handlers/errorHandler.js';
import type { IAccountService } from '../Account/types.js';
import type { PostService } from '../Post/postService.js';
import type { IProfile, IProfileService } from './types.js';

class ProfileService implements IProfileService {
  constructor(
    private accountService: IAccountService,
    private postService: PostService,
  ) {}

  async getMe(userId: number): Promise<IProfile> {
    try {
      if (userId == undefined) {
        throw new ErrorHandler('User ID not provided', 400);
      }
      if (typeof userId !== 'number') {
        throw new ErrorHandler('User ID must be a number', 400);
      }
      const user = await this.accountService.findUserById(userId);
      if (!user) {
        throw new ErrorHandler('User not found', 404);
      }
      const content = await this.postService.findByAuthor(userId, userId);
      return {
        fullName: user.firstName + ' ' + user.lastName,
        birthdayDate: user.birthdayDate,
        joinDate: user.created_at,
        description: 'Test description hardcoded by coder.',
        content: content,
      };
    } catch (error) {
      throw error;
    }
  }
  async get(userId: number, requestedId: number): Promise<IProfile> {
    try {
      if (userId === requestedId) {
        const res = await this.getMe(userId);
        return res;
      }
      if (userId == undefined) {
        throw new ErrorHandler('User ID not provided', 400);
      }
      if (typeof userId !== 'number') {
        throw new ErrorHandler('User ID must be a number', 400);
      }
      const user = await this.accountService.findUserById(userId);
      if (!user) {
        throw new ErrorHandler('User not found', 404);
      }
      const content = await this.postService.findByAuthor(userId, requestedId);
      return {
        fullName: user.firstName + ' ' + user.lastName,
        birthdayDate: user.birthdayDate,
        joinDate: user.created_at,
        description: 'Test description hardcoded by coder.',
        content: content,
      };
    } catch (error) {
      throw error;
    }
  }
}

export { ProfileService };
