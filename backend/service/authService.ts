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
        const accessToken: string = jwt.sign({ id: +existingUser.id, tokenType: 'access' }, process.env['TALKER_SERVER_JWT_ACCESS_SECRET']!, { expiresIn: '5m' })
        const refreshToken: string = jwt.sign({ id: +existingUser.id, tokenType: 'refresh' }, process.env['TALKER_SERVER_JWT_REFRESH_SECRET']!, { expiresIn: '7d' })
        return { id: +existingUser.id, access: accessToken, refresh: refreshToken }
    }
    async signUp(document: IAccountInsertDTO): Promise<boolean | null> {
        const result = await this.accountService.insertUser(document)
        return result
    }
    signNewToken(userId: number, tokenType: 'access' | 'refresh'): string {
        const secret = {
            'access': { secret: process.env['TALKER_SERVER_JWT_ACCESS_SECRET']!, expiresIn: '5m' as const },
            'refresh': { secret: process.env['TALKER_SERVER_JWT_REFRESH_SECRET']!, expiresIn: '7d' as const }
        }
        const token = jwt.sign({ id: userId, tokenType }, secret[tokenType].secret, { expiresIn: secret[tokenType].expiresIn })
        return token
    }
}