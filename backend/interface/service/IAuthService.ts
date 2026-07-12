import type { SignOptions } from "jsonwebtoken";
import type { IAccountInsertDTO } from "../repository/IAccountRepository.js";
import type { IUser } from "./IAccountService.js";

export interface IAuthService {
    signUp(document: IAccountInsertDTO): Promise<boolean | null>

    signIn(document: ILogin): Promise<IUser | null>;
    signNewToken(userId: number, tokenType: 'access' | 'refresh'): string
}
export interface ILogin {
    email: string;
    password: string
}
