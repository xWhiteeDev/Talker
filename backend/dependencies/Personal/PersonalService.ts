import type {IPersonal, IPersonalInsertDTO, IPersonalRepository, IPersonalService, IPersonalUpdateDTO} from "./types.js";

export class PersonalService implements IPersonalService {
    constructor(private repository: IPersonalRepository) {

    }
    async getPersonal(userId: number): Promise<IPersonal | undefined> {
        const result = await this.repository.getByUserId(userId);
        return result;
    }
    async insertPersonal(document: IPersonalInsertDTO): Promise<boolean> {
        const isPersonalExist = await this.repository.isAnyExist(document.user_id);
        if (isPersonalExist) {
            return false;
        }
        const insertingResult = await this.repository.insert(document);
        return insertingResult;
    }
    async updatePersonal(userId: number, updateDocument: IPersonalUpdateDTO): Promise<boolean> {
        const isPersonalExist = await this.repository.isAnyExist(userId);
        if (!isPersonalExist) {
            return false;
        }
        const updateResult = await this.repository.update(userId, updateDocument);
        return updateResult;
    }
    async deletePersonal(userId: number): Promise<boolean> {
        const isPersonalExist = await this.repository.isAnyExist(userId);
        if (!isPersonalExist) {
            return false;
        }
        const deletingResult = await this.repository.delete(userId);
        return deletingResult
    }

}