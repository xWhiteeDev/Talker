import { AuthController } from "../controller/Auth/authController.js";
import { createPool } from "../database/database.js";
import { AccountRepository } from "../repository/authRepository.js";
import { AccountService } from "../service/authService.js";

export const dbPool = createPool();
const accountRepository = new AccountRepository(dbPool)
const accountService = new AccountService(accountRepository)
export const authController = new AuthController(accountService)
console.log(`\x1b[42;1m✅ All dependencies loaded correctly! \x1b[0m`)
