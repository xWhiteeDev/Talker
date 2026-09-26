import {beforeEach, describe, expect, it, vi} from "vitest";
import {AccountService} from "../../../dependencies/Account/accountService.js";
import type {IAccountInsertDTO} from "../../../dependencies/Account/types.js";
import bcrypt from "bcryptjs";


vi.mock('bcryptjs', () => ({
    default: {
        hash: vi.fn(),
        compare: vi.fn()
    }
}));

describe('insertUser', () => {
    const fakeInsertData: IAccountInsertDTO = {
        email: "test1234@proton.me",
        password: "123456a",
        birthdayDate: "11/02/2000",
        firstName: "Jacob",
        lastName: "Sohan"
    };
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('Should throw an error when user aleardy exist', async () => {
        const fakeAccountRepository = {
            isExist: vi.fn().mockResolvedValue(true),
            insert: vi.fn()
        };
        const service = new AccountService(fakeAccountRepository as any);
        await expect(service.insertUser(fakeInsertData)).rejects.toThrow('User already exist');
        expect(fakeAccountRepository.insert).not.toHaveBeenCalled();
    });
    it('Should throw an error when hashing goes wrong', async () => {
        vi.mocked(bcrypt.hash).mockRejectedValue(new Error('Random err during hashing password'));
        const fakeAccountRepository = {
            isExist: vi.fn().mockResolvedValue(false),
            insert: vi.fn()
        };
        const service = new AccountService(fakeAccountRepository as any);
        await expect(service.insertUser(fakeInsertData)).rejects.toThrow('Random err during hashing password');
        expect(fakeAccountRepository.insert).not.toHaveBeenCalled();
    });
    it('Should return true when everything ok', async () => {
        const fakeAccountRepository = {
            isExist: vi.fn().mockResolvedValue(false),
            insert: vi.fn().mockResolvedValue(true)
        };
        const service = new AccountService(fakeAccountRepository as any);
        await expect(service.insertUser(fakeInsertData)).resolves.toBe(true);
    });
    it('Should return false when insert failed', async () => {
        const fakeAccountRepository = {
            isExist: vi.fn().mockResolvedValue(false),
            insert: vi.fn().mockResolvedValue(false)
        };
        const service = new AccountService(fakeAccountRepository as any);
        await expect(service.insertUser(fakeInsertData)).resolves.toBe(false);
    });
});

describe('updateUser', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    const fakeUpdateData = {
        email: 'test12345@proton.me',
        lastName: 'Hilton',
        password: '1234567a'
    };
    it('Should throw an error when user aleardy exist', async () => {

        const fakeAccountRepository = {
            isExist: vi.fn().mockResolvedValue(false),
            update: vi.fn()
        };
        const service = new AccountService(fakeAccountRepository as any);
        await expect(service.updateUser(fakeUpdateData)).rejects.toThrow('User not exist');
        expect(fakeAccountRepository.update).not.toHaveBeenCalled();
    });
    it('Should throw an error when password to update passed and hashing goes wrong', async () => {
        vi.mocked(bcrypt.hash).mockRejectedValue(new Error('Random err during hashing password'));
        const fakeAccountRepository = {
            isExist: vi.fn().mockResolvedValue(true),
            update: vi.fn()
        };
        const service = new AccountService(fakeAccountRepository as any);
        await expect(service.updateUser(fakeUpdateData)).rejects.toThrow('Random err during hashing password');
    });
    it('Should return true when everything ok', async () => {
        const fakeAccountRepository = {
            isExist: vi.fn().mockResolvedValue(true),
            update: vi.fn().mockResolvedValue(true)
        };
        const service = new AccountService(fakeAccountRepository as any);
        await expect(service.updateUser(fakeUpdateData)).resolves.toBe(true);
    });
    it('Should return false when update failed', async () => {
        const fakeAccountRepository = {
            isExist: vi.fn().mockResolvedValue(true),
            update: vi.fn().mockResolvedValue(false)
        };
        const service = new AccountService(fakeAccountRepository as any);
        await expect(service.updateUser(fakeUpdateData)).resolves.toBe(false);
    });

});

describe('findUserWithCredentials', () => {
    it('Should passsed when provided email in repository is the same as provided in service ', async () => {
        const fakeRepository = {
            findWithCredentials: vi.fn()
        };
        const service = new AccountService(fakeRepository as any);
        const testEmail = 'test@proton.me';
        await service.findUserWithCredentials(testEmail);
        expect(fakeRepository.findWithCredentials).toHaveBeenCalledWith(testEmail);
    });
    it('Should return user row when found', async () => {
        const fakeDbRow = {
            email: 'test@proton.me'
        };
        const fakeRepository = {
            findWithCredentials: vi.fn().mockResolvedValue(fakeDbRow)
        };
        const service = new AccountService(fakeRepository as any);
        const testEmail = 'test@proton.me';
        const result = await service.findUserWithCredentials(testEmail);
        expect(result).toBe(fakeDbRow);
    });
});

describe('findUserById', () => {
    it('Should passsed when provided id in repository is the same as provided in service ', async () => {
        const fakeRepository = {
            findById: vi.fn()
        };
        const service = new AccountService(fakeRepository as any);
        const testId = 2;
        await service.findUserById(testId);
        expect(fakeRepository.findById).toHaveBeenCalledWith(testId);
    });
    it('Should return user row when found', async () => {
        const fakeDbRow = {
            id: 5
        };
        const fakeRepository = {
            findById: vi.fn().mockResolvedValue(fakeDbRow)
        };
        const service = new AccountService(fakeRepository as any);
        const testId = 5;
        const result = await service.findUserById(testId);
        expect(result).toBe(fakeDbRow);
    });
});

describe('isUserExist', () => {
    it('Should passed when provided argument is the same as input', async () => {
        const testEmail = 'test@proton.me';
        const fakeRepo = {
            isExist: vi.fn()
        };
        const service = new AccountService(fakeRepo as any);
        await service.isUserExist(testEmail);
        expect(fakeRepo.isExist).toHaveBeenCalledWith(testEmail);
    });
    it('Should return true when user exist', async () => {
        const testEmail = 'test@proton.me';
        const fakeRepo = {
            isExist: vi.fn().mockResolvedValue(true)
        };
        const service = new AccountService(fakeRepo as any);
        await expect(service.isUserExist(testEmail)).resolves.toBe(true);
    });
});

describe('deleteUser', () => {
    it('Should be passed when repository argument matching with input', async () => {
        const testEmail = 'test@proton.me';
        const fakeRepo = {
            isExist: vi.fn().mockResolvedValue(true),
            delete: vi.fn().mockResolvedValue(true)
        };
        const service = new AccountService(fakeRepo as any);
        await service.deleteUser(testEmail);
        expect(fakeRepo.isExist).toHaveBeenCalledWith(testEmail);
        expect(fakeRepo.delete).toHaveBeenCalledWith(testEmail);

    });
    it('Should return false when user not exist', async () => {
        const testEmail = 'test@proton.me';
        const fakeRepo = {
            isExist: vi.fn().mockResolvedValue(false)
        };
        const service = new AccountService(fakeRepo as any);
        await expect(service.deleteUser(testEmail)).resolves.toBe(false);
    });
    it('Should return true when user exist and delete succeed', async () => {
        const testEmail = 'test@proton.me';
        const fakeRepo = {
            isExist: vi.fn().mockResolvedValue(true),
            delete: vi.fn().mockResolvedValue(true),

        };
        const service = new AccountService(fakeRepo as any);
        await expect(service.deleteUser(testEmail)).resolves.toBe(true);
    });
});

describe('findUserByCriteria', () => {
    it('Should pass correct args and return its result', async () => {
        const fakeAcountRow = [{fullName: 'Max Harris', id: 3}];
        const fakeRepository = {
            findByCriteria: vi.fn().mockResolvedValue(fakeAcountRow)
        };
        const service = new AccountService(fakeRepository as any);
        const result = await service.findUserByCriteria('Max', 'Harris');
        expect(fakeRepository.findByCriteria).toHaveBeenCalledWith('Max', 'Harris');
        expect(result).toBe(fakeAcountRow);
    });
});