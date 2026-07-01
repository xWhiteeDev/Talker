import bcrypt from "bcryptjs";
import type { IAccountRow } from "../interface/database/IAccount.js";
import type { IAccountRepository, IAccountInsertDTO, IAccountUpdateDTO } from "../interface/repository/IAccountRepository.js";
import type { IAccountService } from "../interface/service/IAccountService.js";
import { ErrorHandler } from "../handlers/errorHandler.js";

export class AccountService implements IAccountService {
    constructor(private accountRepository: IAccountRepository) {
        console.log(`\x1b[32;1m🚀[AccountService] accountRepository injected \x1b[0m`)
    }
    async insertUser(data: IAccountInsertDTO): Promise<boolean> {
        const existingUser = await this.accountRepository.isExist(data.email)
        if (existingUser) {
            throw new ErrorHandler("User already exist", 400)
        }
        const payload = { ...data }
        payload.firstName = data.firstName.trim();
        payload.lastName = data.lastName.trim();
        try {
            payload.password = await bcrypt.hash(data.password, 12);

        } catch (error) {
            return false
        }

        const result = await this.accountRepository.insert(payload)
        return result
    }
    async updateUser(data: IAccountUpdateDTO): Promise<boolean> {
        const existingUser = await this.accountRepository.isExist(data.email)
        if (!existingUser) return false
        const payload = { ...data }
        if (data.password) {
            try {
                payload.password = await bcrypt.hash(data.password, 12);

            } catch (error) {
                return false
            }
        }
        return await this.accountRepository.update(payload);

    }
    async findUserWithCredentials(email: string): Promise<IAccountRow | null> {
        const result = await this.accountRepository.findWithCredentials(email)
        return result
    }
    async isUserExist(email: string): Promise<boolean> {
        const result = await this.accountRepository.isExist(email)
        return result
    }
    async deleteUser(email: string): Promise<boolean> {
        const existingUser = await this.accountRepository.isExist(email);
        if (!existingUser) return false
        const result = await this.accountRepository.delete(email);
        return result
    }
}