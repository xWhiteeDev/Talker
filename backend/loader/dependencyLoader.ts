import {AuthController} from '../dependencies/Auth/authController.js';
import {createPool} from '../database/database.js';
import {AuthService} from '../dependencies/Auth/authService.js';
import {AccountRepository} from '../dependencies/Account/accountRepository.js';
import {AccountService} from '../dependencies/Account/accountService.js';
import {friendshipRepository} from '../dependencies/Friendship/friendshipRepository.js';
import {friendshipService} from '../dependencies/Friendship/friendshipService.js';
import {friendshipController} from '../dependencies/Friendship/friendshipController.js';
import {PostRepository} from '../dependencies/Post/postRepository.js';
import {PostService} from '../dependencies/Post/postService.js';
import {PostController} from '../dependencies/Post/postController.js';
import {PostReactionRepository} from '../dependencies/PostReaction/postReactionRepository.js';
import {PostReactionService} from '../dependencies/PostReaction/postReactionService.js';
import {PostReactionController} from '../dependencies/PostReaction/postReactionController.js';
import {CommentsRepository} from '../dependencies/Comments/CommentsRepository.js';
import {CommentsService} from '../dependencies/Comments/CommentsService.js';
import {CommentsController} from '../dependencies/Comments/CommentsController.js';
import {CommentReactionRepository} from '../dependencies/CommentReaction/CommentReactionRepository.js';
import {CommentReactionService} from '../dependencies/CommentReaction/CommentReactionService.js';
import {CommentReactionController} from '../dependencies/CommentReaction/CommentReactionController.js';
import {SearchService} from '../dependencies/Search/searchService.js';
import {SearchController} from '../dependencies/Search/searchController.js';
import {CodeRepository} from '../dependencies/Code/codeRepository.js';
import {CodeService} from '../dependencies/Code/codeService.js';
import {CodeController} from '../dependencies/Code/codeController.js';
import {Emailer} from '../services/Resend/Resend.js';
import {PersonalRepository} from '../dependencies/Personal/PersonalRepository.js';
import {PersonalService} from '../dependencies/Personal/PersonalService.js';

export const dbPool = createPool();
const accountRepository = new AccountRepository(dbPool);
const accountService = new AccountService(accountRepository);

const friendsRepository = new friendshipRepository(dbPool);
const friendsService = new friendshipService(friendsRepository);
export const friendsController = new friendshipController(friendsService);

const postRepository = new PostRepository(dbPool);
const postService = new PostService(postRepository, friendsService, accountService);
export const postController = new PostController(postService);

const postReactionRepository = new PostReactionRepository(dbPool);
const postReactionService = new PostReactionService(postReactionRepository);
export const postReactionController = new PostReactionController(postReactionService, postService);

const commentsRepository = new CommentsRepository(dbPool);
const commentsService = new CommentsService(commentsRepository);
export const commmentsController = new CommentsController(commentsService, postService);

const commentReactionRepository = new CommentReactionRepository(dbPool);
const commentReactionService = new CommentReactionService(commentReactionRepository);
export const commentReactionController = new CommentReactionController(commentReactionService, postService, commentsService);

const searchService = new SearchService(accountService);
export const searchController = new SearchController(searchService);

const personalRepository = new PersonalRepository(dbPool);
const personalService = new PersonalService(personalRepository);


const codeRepository = new CodeRepository(dbPool);
const codeService = new CodeService(codeRepository, accountService, Emailer);

export const authService = new AuthService(accountService, personalService, codeService, Emailer);
export const authController = new AuthController(authService);
export const codeController = new CodeController(codeService);