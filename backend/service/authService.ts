import bcrypt from "bcryptjs";
import type { IAccountService, IUser } from "../interface/service/IAccountService.js";
import type { IAuthService, ILogin } from "../interface/service/IAuthService.js";
import jwt from 'jsonwebtoken'
import { configDotenv } from "dotenv";
import type { IAccountInsertDTO } from "../interface/repository/IAccountRepository.js";
import { ErrorHandler } from "../handlers/errorHandler.js";

configDotenv()
export class AuthService implements IAuthService {
    constructor(private accountService: IAccountService) { }
    async signIn(document: ILogin): Promise<IUser | null> {
        const existingUser = await this.accountService.findUserWithCredentials(document.email);
        if (!existingUser) {
            throw new ErrorHandler("Invalid data", 400)
        }
        const comparedPassword = await bcrypt.compare(document.password, existingUser.password)
        if (!comparedPassword) {
            throw new ErrorHandler("Invalid data", 400)
        }
        const token = jwt.sign({ id: existingUser.id }, process.env['TALKER_SERVER_JWT_SECRET']!)
        return { id: +existingUser.id, token: token }
    }
    async signUp(document: IAccountInsertDTO): Promise<boolean | null> {
        const result = await this.accountService.insertUser(document)
        return result
    }
}