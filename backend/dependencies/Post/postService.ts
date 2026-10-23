import type {TExecutor} from '../../database/helper/transactionRunner.js';
import {ErrorHandler} from '../../handlers/errorHandler.js';
import type {IAccountService} from '../Account/types.js';
import type {IFriendshipService} from '../Friendship/types.js';
import type {PostRow, PostInsertDTO, PostUpdateDTO, IPostService, IPostRepository, IPost} from './types.js';

export class PostService implements IPostService {
  constructor(
    private PostRepository: IPostRepository,
    private FriendsService: IFriendshipService,
    private accountService: IAccountService,
  ) {
  }
  async findById(userId: number, id: number, withComments?: boolean): Promise<PostRow | null> {
    let existingPost;
    if (withComments) {
      existingPost = await this.PostRepository.findById(id, userId, true);
    } else {
      existingPost = await this.PostRepository.findById(id, userId);
    }
    if (!existingPost) throw new ErrorHandler('Post does not exist', 404);
    const postVisibility = existingPost.visible_for;
    if (postVisibility === 'Public') {
      return existingPost;
    }
    if (existingPost.authorId === userId) {
      return existingPost;
    }
    if (postVisibility === 'Friends') {
      const relationBetweenUsers = await this.FriendsService.findRelationBetween(userId, existingPost.authorId, 'accepted');
      if (!relationBetweenUsers) return null;
      return existingPost;
    }
    return null;
  }
  async findLatestPosts(userId: number): Promise<PostRow[] | null> {
    const postsToFeed = await this.PostRepository.findAll(userId);
    if (postsToFeed == null) {
      return null;
    }
    return postsToFeed;
  }
  async findByAuthor(userId: number, authorId: number): Promise<PostRow[] | null> {
    const existingPost = await this.PostRepository.findByAuthor(userId, authorId);
    return existingPost;
  }
  async insertPost(dto: PostInsertDTO, currentUserId:number ,executor?: TExecutor): Promise<IPost> {
    const authorAccount = await this.accountService.findUserById(dto.authorId);
    if (!authorAccount) {
      console.log('Author not exist');
      throw new ErrorHandler('User not exist', 400);
    }
    const newPostId: number = await this.PostRepository.insert(dto, executor);
    if (isNaN(newPostId)) {
      throw new ErrorHandler('Operation failed', 400);
    }
    const newPost = await this.PostRepository.findById(newPostId,currentUserId);
    if (!newPost) {
      throw new ErrorHandler('Cannot get post', 400);
    }
    return newPost;
  }
  async updatePost(userId: number, id: number, dto: PostUpdateDTO, executor?: TExecutor): Promise<boolean> {
    const existingPost: PostRow | undefined = await this.PostRepository.findById(id, userId);
    if (!existingPost) throw new ErrorHandler('Post does not exist', 404);
    if (userId !== existingPost.authorId) throw new ErrorHandler('Access denied', 403);
    const result = await this.PostRepository.update(id, dto, executor);
    if (!result) {
      throw new ErrorHandler('Operation failed', 400);
    }
    return result;
  }
  async deletePost(userId: number, id: number, executor?: TExecutor): Promise<boolean> {
    const existingPost: PostRow | undefined = await this.PostRepository.findById(id, userId);
    if (!existingPost) throw new ErrorHandler('Post does not exist', 404);
    if (userId !== existingPost.authorId) throw new ErrorHandler('Access denied', 403);
    const result = await this.PostRepository.delete(id, executor);
    if (!result) {
      throw new ErrorHandler('Operation failed', 400);
    }
    return result;
  }
}
