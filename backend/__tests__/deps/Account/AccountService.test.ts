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