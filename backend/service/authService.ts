import bcrypt from "bcryptjs";
import type { IAccountRow } from "../interface/database/IAccount.js";
import type { IAuthRepository, IAuthInsertDTO, IAuthUpdateDTO } from "../interface/repository/IAuthRepository.js";
import type { IAuthService } from "../interface/service/IAuthService.js";

export class AuthService implements IAuthService {
    constructor(private authRepository: IAuthRepository) {
        console.log(`\x1b[32;1m🚀[AuthService] authRepository injected \x1b[0m`)
    }
    async insertUser(data: IAuthInsertDTO): Promise<boolean> {
        const existingUser = await this.authRepository.isExist(data.email)

        if (existingUser) return false
        const payload = { ...data }
        payload.firstName = data.firstName.trim();
        payload.lastName = data.lastName.trim();
        try {
            payload.password = await bcrypt.hash(data.password, 12);

        } catch (error) {
            return false
        }

        const result = await this.authRepository.insert(payload)
        return result
    }
    async updateUser(data: IAuthUpdateDTO): Promise<boolean> {
        const existingUser = await this.authRepository.isExist(data.email)
        if (!existingUser) return false
        const payload = { ...data }
        if (data.password) {
            try {
                payload.password = await bcrypt.hash(data.password, 12);

            } catch (error) {
                return false
            }
        }
        return await this.authRepository.update(payload);

    }
    async findUserWithCredentials(email: string): Promise<IAccountRow | null> {
        const result = await this.authRepository.findWithCredentials(email)
        return result
    }
    async isUserExist(email: string): Promise<boolean> {
        const result = await this.authRepository.isExist(email)
        return result
    }
    async deleteUser(email: string): Promise<boolean> {
        const existingUser = await this.authRepository.isExist(email);
        if (!existingUser) return false
        const result = await this.authRepository.delete(email);
        return result
    }
}