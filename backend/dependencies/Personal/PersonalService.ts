import type {TExecutor} from "../../database/helper/transactionRunner.js";
import type {IPersonal, IPersonalInsertDTO, IPersonalRepository, IPersonalService, IPersonalUpdateDTO} from "./types.js";

export class PersonalService implements IPersonalService {
    constructor(private repository: IPersonalRepository) {

    }
    async getPersonal(userId: number): Promise<IPersonal | null> {
        const result = await this.repository.getByUserId(userId);
        if (!result) return null;
        const convertedPayload: IPersonal = {
            id: result.id,
            userId: result.user_id,
            firstName: result.first_name,
            lastName: result.last_name,
            birthDate: result.birth_date,
            livingPlace: result.living_place,
            gender: result.gender
        };
        return convertedPayload;
    }
    async insertPersonal(document: IPersonalInsertDTO, executor?: TExecutor): Promise<boolean> {
        const isPersonalExist = await this.repository.isAnyExist(document.user_id);
        if (isPersonalExist) {
            return false;
        }
        const insertingResult = await this.repository.insert(document, executor);
        return insertingResult;
    }
    async updatePersonal(userId: number, updateDocument: IPersonalUpdateDTO, executor?: TExecutor): Promise<boolean> {
        const isPersonalExist = await this.repository.isAnyExist(userId);
        if (!isPersonalExist) {
            return false;
        }
        const updateResult = await this.repository.update(userId, updateDocument, executor);
        return updateResult;
    }
    async deletePersonal(userId: number, executor?: TExecutor): Promise<boolean> {
        const isPersonalExist = await this.repository.isAnyExist(userId);
        if (!isPersonalExist) {
            return false;
        }
        const deletingResult = await this.repository.delete(userId, executor);
        return deletingResult;
    }

}