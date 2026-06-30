import bcrypt from "bcryptjs";
import type { IAccountRow } from "../interface/database/IAccount.js";
import type { IAuthRepository, IAuthInsertDTO, IAuthUpdateDTO } from "../interface/repository/IAuthRepository.js";
import type { IAuthService } from "../interface/service/IAuthService.js";

export class AuthService implements IAuthService {
    constructor(private authRepository: IAuthRepository) {
        console.log(`\x1b[32;1m🚀[AuthService] authRepository injected \x1b[0m`)
    }
    async insert(data: IAuthInsertDTO): Promise<boolean> {
        const existingUser = await this.authRepository.findByEmail(data.email)

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
    async update(data: IAuthUpdateDTO): Promise<boolean> {
        const existingUser = await this.authRepository.findByEmail(data.email)
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
    async findByEmail(email: string): Promise<IAccountRow | null> {
        const result = await this.authRepository.findByEmail(email)
        return result
    }
    async delete(email: string): Promise<boolean> {
        const existingUser = await this.authRepository.findByEmail(email);
        if (!existingUser) return false
        const result = await this.authRepository.delete(email);
        return result
    }
}