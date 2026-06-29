import bcrypt from "bcryptjs";
import type { IAccountRow } from "../interface/database/IAccount.js";
import type { IAuthRepository, IAuthInsertDTO, IAuthUpdateDTO } from "../interface/repository/IAuthRepository.js";
import type { IAuthService } from "../interface/service/IAuthService.js";

export class AuthService implements IAuthService {
    constructor(private authRepository: IAuthRepository) {
        console.log(`[AuthService] authRepository included`);
    }
    async insert(email: string, data: IAuthInsertDTO): Promise<boolean> {
        const existingUser = await this.authRepository.findByEmail(email)
        if (existingUser) return false
        const payload = { ...data }
        payload.firstName = data.firstName.trim();
        payload.lastName = data.lastName.trim();
        try {
            payload.password = await bcrypt.hash(data.password, 12);
        } catch (error) {
            return false
        }

        const result = await this.authRepository.insert(email, payload)
        return result
    }
    async update(email: string, dto: IAuthUpdateDTO): Promise<boolean> {
        const existingUser = await this.authRepository.findByEmail(email)
        if (!existingUser) return false
        const payload = { ...dto }
        if (dto.password) {
            try {
                payload.password = await bcrypt.hash(dto.password, 12);

            } catch (error) {
                return false
            }
        }
        return await this.authRepository.update(email, payload);

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