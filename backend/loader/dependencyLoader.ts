import { AuthController } from "../controller/Auth/authController.js";
import { createPool } from "../database/database.js";
import { AuthRepository } from "../repository/authRepository.js";
import { AuthService } from "../service/authService.js";

export const dbPool = createPool();
const authRepository = new AuthRepository(dbPool)
const authService = new AuthService(authRepository)
export const authController = new AuthController(authService)
console.log(`\x1b[42;1m✅ All dependencies loaded correctly! \x1b[0m`)
