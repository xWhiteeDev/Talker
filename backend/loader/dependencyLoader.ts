import { AuthController } from "../dependencies/Auth/authController.js";
import { createPool } from "../database/database.js";
import { AuthService } from "../dependencies/Auth/authService.js";
import {AccountRepository} from "../dependencies/Account/accountRepository.js";
import {AccountService} from "../dependencies/Account/accountService.js";

export const dbPool = createPool();
const accountRepository = new AccountRepository(dbPool)
const accountService = new AccountService(accountRepository);
export const authService = new AuthService(accountService)
export const authController = new AuthController(authService)
console.log(`\x1b[42;1m✅ All dependencies loaded correctly! \x1b[0m`)
