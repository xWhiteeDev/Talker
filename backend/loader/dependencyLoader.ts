import { AuthController } from "../controller/Auth/authController.js";
import { createPool } from "../database/database.js";
import { AccountRepository } from "../repository/accountRepository.js";
import { AccountService } from "../service/accountService.js";
import { AuthService } from "../service/authService.js";

export const dbPool = createPool();
const accountRepository = new AccountRepository(dbPool)
const accountService = new AccountService(accountRepository);
export const authService = new AuthService(accountService)
export const authController = new AuthController(authService)
console.log(`\x1b[42;1m✅ All dependencies loaded correctly! \x1b[0m`)
