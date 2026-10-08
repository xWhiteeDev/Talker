import type {ICodeInsertDTO, ICodeRepository, ICodeRow, ICodeService, ICodeUpdateDTO, TCodeType} from "./types.js";

export class CodeService implements ICodeService {
    constructor(private codeRepository: ICodeRepository) {

    }
    async getCode(email: string, type: TCodeType): Promise<ICodeRow | undefined> {
        const result = await this.codeRepository.get(email, type);
        return result;
    }
    async getAllCodesFor(email: string): Promise<ICodeRow[] | undefined> {
        const result = await this.codeRepository.getAllFor(email);
        return result;
    }
    async insertCode(document: ICodeInsertDTO): Promise<boolean> {
        const existingCode: ICodeRow | undefined = await this.codeRepository.get(document.email, document.type);
        if (existingCode) {
            return false;
        }
        const result = await this.codeRepository.insert(document);
        return result;
    }
    async updateCode(email: string, type: TCodeType, updateDocument: ICodeUpdateDTO): Promise<boolean> {
        const existingCode: ICodeRow | undefined = await this.codeRepository.get(email, type);
        if (!existingCode) {
            return false;
        }
        const result = await this.codeRepository.update(email, type, updateDocument);
        return result;
    }
    async deleteCode(email: string, type: TCodeType): Promise<boolean> {
        const existingCode: ICodeRow | undefined = await this.codeRepository.get(email, type);
        if (!existingCode) {
            return false;
        }
        const result = await this.codeRepository.delete(email, type);
        return result;
    }

}