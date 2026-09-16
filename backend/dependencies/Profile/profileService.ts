import { ErrorHandler } from '../../handlers/errorHandler.js';
import type { IAccountRow, IAccountService } from '../Account/types.js';
import type { friendshipService } from '../Friendship/friendshipService.js';
import type { FriendsRelation, IAcceptedRelationRow } from '../Friendship/types.js';
import type { PostService } from '../Post/postService.js';
import type { PostRow } from '../Post/types.js';
import type { IProfile, IProfileService } from './types.js';

class ProfileService implements IProfileService {
  constructor(
    private accountService: IAccountService,
    private postService: PostService,
    private friendshipsService: friendshipService,
  ) {}

  async get(userId: number, requestedId: number): Promise<IProfile> {
    try {
      if (userId == undefined) {
        throw new ErrorHandler('User ID not provided', 400);
      }
      if (typeof userId !== 'number') {
        throw new ErrorHandler('User ID must be a number', 400);
      }
      if (typeof requestedId !== 'number' || requestedId < 0) {
        throw new ErrorHandler('RequestId cannot be a value which is not a number!', 400);
      }

      let accountProfileProperties: IAccountRow | null;
      let content: PostRow[] | null = null;
      let friendshipRelation: FriendsRelation | null;
      let friends: IAcceptedRelationRow[] | null;
      if (userId === requestedId) {
        content = await this.postService.findByAuthor(userId, userId);
        accountProfileProperties = await this.accountService.findUserById(requestedId);
        friends = await this.friendshipsService.findAllAcceptedRelations(requestedId);
        friendshipRelation = null;
      } else {
        [content, friendshipRelation, friends] = await Promise.all([
          this.postService.findByAuthor(userId, requestedId),
          this.friendshipsService.findRelationBetween(userId, requestedId),
          this.friendshipsService.findAllAcceptedRelations(requestedId),
        ]);
        accountProfileProperties = await this.accountService.findUserById(requestedId);
      }
      if (!accountProfileProperties) {
        throw new ErrorHandler('Account not found', 404, true);
      }
      return {
        fullName: accountProfileProperties.firstName + ' ' + accountProfileProperties.lastName,
        birthdayDate: accountProfileProperties.birthdayDate,
        joinDate: accountProfileProperties.created_at,
        description: 'My hardcoded description',
        content: content,
        relation: friendshipRelation
          ? {
              status: friendshipRelation.status,
              creator: friendshipRelation.userId,
            }
          : null,
        friends: friends,
      };
    } catch (error) {
      throw error;
    }
  }
}

export { ProfileService };
