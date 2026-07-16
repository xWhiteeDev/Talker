import {AuthController} from "../dependencies/Auth/authController.js";
import {createPool} from "../database/database.js";
import {AuthService} from "../dependencies/Auth/authService.js";
import {AccountRepository} from "../dependencies/Account/accountRepository.js";
import {AccountService} from "../dependencies/Account/accountService.js";
import {friendshipRepository} from "../dependencies/Friendship/friendshipRepository.js";
import {friendshipService} from "../dependencies/Friendship/friendshipService.js";
import {friendshipController} from "../dependencies/Friendship/friendshipController.js";
import {PostRepository} from "../dependencies/Post/postRepository.js";
import {PostService} from "../dependencies/Post/postService.js";
import {PostController} from "../dependencies/Post/postController.js";

export const dbPool = createPool();
const accountRepository = new AccountRepository(dbPool);
const accountService = new AccountService(accountRepository);
export const authService = new AuthService(accountService);
export const authController = new AuthController(authService);
const friendsRepository = new friendshipRepository(dbPool);
const friendsService = new friendshipService(friendsRepository);
export const friendsController = new friendshipController(friendsService);


const postRepository = new PostRepository(dbPool);
const postService = new PostService(postRepository, friendsService);
export const postController = new PostController(postService);
console.log(`\x1b[42;1m✅ All dependencies loaded correctly! \x1b[0m`);
