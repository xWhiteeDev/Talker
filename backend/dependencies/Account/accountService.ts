import bcrypt from "bcryptjs";
import type {IAccountInsertDTO, IAccountRepository, IAccountRow, IAccountService, IAccountUpdateDTO} from "./types.js";
import {ErrorHandler} from "../../handlers/errorHandler.js";
import type {TExecutor} from "../../database/helper/transactionRunner.js";

export class AccountService implements IAccountService {
    constructor(private accountRepository: IAccountRepository) {
    }
    async insertUser(data: IAccountInsertDTO, executor: TExecutor): Promise<number | null> {
        const existingAccount = await this.accountRepository.isExist(data.email);
        if (existingAccount) {
            return null;
        }
        const payload = {...data};
        try {
            payload.password = await bcrypt.hash(data.password, 12);
        } catch (error) {
            throw error;
        }
        const result = await this.accountRepository.insert(payload, executor);
        return result;
    }
    async updateUser(data: IAccountUpdateDTO, executor: TExecutor): Promise<boolean> {
        const existingUser = await this.accountRepository.isExist(data.email);
        if (!existingUser) {
            throw new ErrorHandler("User not exist", 400);
        }
        const payload = {...data};
        if (data.password) {
            try {
                payload.password = await bcrypt.hash(data.password, 12);
            } catch (error) {
                throw error;
            }
        }
        return await this.accountRepository.update(payload, executor);

    }
    async findUserWithCredentials(email: string): Promise<IAccountRow | null> {
        const result = await this.accountRepository.findWithCredentials(email);
        return result;
    }
    async findUserById(id: number): Promise<IAccountRow | null> {
        const result = await this.accountRepository.findById(id);
        return result;
    }
    async isUserExist(email: string): Promise<boolean> {
        const result = await this.accountRepository.isExist(email);
        return result;
    }
    async deleteUser(email: string, executor: TExecutor): Promise<boolean> {
        const existingUser = await this.accountRepository.isExist(email);
        if (!existingUser) return false;
        const result = await this.accountRepository.delete(email, executor);
        return result;
    }
    async markWelcomeSeen(email: string, state: boolean, executor: TExecutor): Promise<boolean> {
        const existingUser = await this.accountRepository.isExist(email);
        if (!existingUser) return false;
        const result = await this.accountRepository.update({email: email, welcome_seen: state}, executor);
        return result;
    }
}