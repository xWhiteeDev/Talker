import {describe, expect, it, vi} from "vitest";
import {AccountRepository} from "../../../dependencies/Account/accountRepository.js";
import type {IAccountInsertDTO} from "../../../dependencies/Account/types.js";

describe('findWithCredentials', () => {
    it('Should return null when account not found with this email', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new AccountRepository(fakePool as any);
        await expect(repo.findWithCredentials('test@proton.me')).resolves.toBe(null);
    });
    it('Should be passed when query WHERE clause is correct', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[{id: 1, email: 'test@proton.me'}]])
        };
        const repo = new AccountRepository(fakePool as any);
        await repo.findWithCredentials('test@proton.me');
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE email=:email'), {email: 'test@proton.me'});
    });

    it('Should return result when account found', async () => {
        const fakeRow = {
            id: 2,
            firstName: "Jacob",
            lastName: "String",
            birthdayDate: "11/02/2000",
            created_at: "11/06/2026",
            email: "test@proton.me",
            password: "123456"
        };
        const fakePool = {
            query: vi.fn().mockResolvedValue([[fakeRow]])
        };
        const repo = new AccountRepository(fakePool as any);
        const result = await repo.findWithCredentials('test@proton.me');
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE email=:email'), {email: 'test@proton.me'});
        expect(result).toBe(fakeRow);

    });
});

describe('findById', () => {
    it('Should return null when account not found with this id', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new AccountRepository(fakePool as any);
        await expect(repo.findById(2)).resolves.toBe(null);
    });
    it('Should be passed when query WHERE clause is correct', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[{id: 2}]])
        };
        const repo = new AccountRepository(fakePool as any);
        await repo.findById(2);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE id=:id'), {id: 2});
    });
    it('Should return result when account found', async () => {
        const fakeRow = {
            id: 2,
            firstName: "Jacob",
            lastName: "String",
            birthdayDate: "11/02/2000",
            created_at: "11/06/2026",
            email: "test@proton.me",
            password: "123456"
        };
        const fakePool = {
            query: vi.fn().mockResolvedValue([[fakeRow]])
        };
        const repo = new AccountRepository(fakePool as any);
        const result = await repo.findById(2);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE id=:id'), {id: 2});
        expect(result).toBe(fakeRow);
    });
});

describe('findByCriteria', () => {
    it('Should match exact pair when both of criterias are provided', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new AccountRepository(fakePool as any);
        await repo.findByCriteria('Max', 'Harris');
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE ((firstName=:firstString AND lastName=:lastString) OR (lastName=:firstString AND firstName=:lastString))'), {firstString: 'Max', lastString: 'Harris'});
    });

    it('Should return null when result not found', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new AccountRepository(fakePool as any);
        await expect(repo.findByCriteria('Max', 'Harris')).resolves.toBe(null);
    });

    it('Should return account row when everything ok', async () => {
        const fakeRows = [{fullName: "Max Harris", id: 2}];
        const fakePool = {
            query: vi.fn().mockResolvedValue([fakeRows])
        };
        const repo = new AccountRepository(fakePool as any);
        await repo.findByCriteria('Max', 'Harris');
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE ((firstName=:firstString AND lastName=:lastString) OR (lastName=:firstString AND firstName=:lastString))'), {firstString: 'Max', lastString: 'Harris'});
    });
    it('Should return many other rows when only last names are the same', async () => {
        const fakeRows = [
            {
                fullName: 'Calvin Harris',
                id: 55
            },
            {
                fullName: 'Melvin Harris',
                id: 9
            },
            {
                fullName: 'Harris Sam',
                id: 12
            }
        ];
        const fakePool = {
            query: vi.fn().mockResolvedValue([fakeRows])
        };
        const repo = new AccountRepository(fakePool as any);
        await repo.findByCriteria('Harris');
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE firstName=:firstString OR lastName=:firstString'), {firstString: 'Harris', lastString: undefined});
    });
});

describe('isExist', () => {
    it('Should pass when email clausule is correct', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new AccountRepository(fakePool as any);
        await repo.isExist('test@proton.me');
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE email=:email'), {email: 'test@proton.me'});
    });
    it('Should return false when account not exist', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new AccountRepository(fakePool as any);
        const result = await repo.isExist('test@proton.me');
        expect(result).toBe(false);

    });
    it('Should return true when account  exist', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[{}]])
        };
        const repo = new AccountRepository(fakePool as any);
        const result = await repo.isExist('test@proton.me');
        expect(result).toBe(true);
    });
});

describe('insert', () => {
    const fakeInsertData: IAccountInsertDTO = {
        email: "test123@proton.me",
        password: "1234567",
        birthdayDate: "11/02/2000",
        firstName: "Jason",
        lastName: "Harris"
    };
    const correctQuery = expect.stringContaining('(email,password,birthdayDate,firstName,lastName) VALUES (:email,:password,:birthdayDate,:firstName,:lastName)');
    it('Should  fail when failed to insert', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 0}])
        };
        const repo = new AccountRepository(fakePool as any);
        const result = await repo.insert(fakeInsertData);
        expect(fakePool.execute).toHaveBeenCalledWith(correctQuery, fakeInsertData);
        expect(result).toBe(false);
    });

    it('Should succeed when everything ok', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new AccountRepository(fakePool as any);
        const result = await repo.insert(fakeInsertData);
        expect(fakePool.execute).toHaveBeenCalledWith(correctQuery, fakeInsertData);
        expect(result).toBe(true);
    });

});

describe('update', () => {
    it('Should return false when keys and queries parts are empty', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([])
        };
        const repo = new AccountRepository(fakePool as any);
        const update = await repo.update({
            id: 44,
            someNotAllowedKey: ''
        } as any);
        expect(update).toBe(false);
        expect(fakePool.execute).not.toHaveBeenCalled();
    });
    it('Should passed when WHERE clausule correct', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new AccountRepository(fakePool as any);
        await repo.update({
            email: 'test@proton.me',
            lastName: 'Parker'
        });
        expect(fakePool.execute).toHaveBeenCalledWith(expect.stringContaining('WHERE email=:email'), {
            email: 'test@proton.me',
            lastName: 'Parker'
        });
    });
    it('Should return false when affected rows are less than 1', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 0}])
        };
        const repo = new AccountRepository(fakePool as any);
        const result = await repo.update({
            email: 'test@proton.me',
            lastName: 'Parker'
        });
        expect(fakePool.execute).toHaveBeenCalledWith(expect.stringContaining('WHERE email=:email'), {
            email: 'test@proton.me',
            lastName: 'Parker'
        });
        expect(result).toBe(false);

    });
});

describe('delete', () => {
    it('Should pass when WHERE clausule is ok', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new AccountRepository(fakePool as any);
        await repo.delete('test123@proton.me');
        expect(fakePool.execute).toHaveBeenCalledWith(expect.stringContaining('WHERE email=:email'), {email: 'test123@proton.me'});
    });
    it('Should return true when affectedRows greater than 0', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new AccountRepository(fakePool as any);
        const result = await repo.delete('test123@proton.me');
        expect(fakePool.execute).toHaveBeenCalledWith(expect.stringContaining('WHERE email=:email'), {email: 'test123@proton.me'});
        expect(result).toBe(true);
    });
    it('Should return false when affectedRows less than 1', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 0}])
        };
        const repo = new AccountRepository(fakePool as any);
        const result = await repo.delete('test123@proton.me');
        expect(fakePool.execute).toHaveBeenCalledWith(expect.stringContaining('WHERE email=:email'), {email: 'test123@proton.me'});
        expect(result).toBe(false);
    });
});