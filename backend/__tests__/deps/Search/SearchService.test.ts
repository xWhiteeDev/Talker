import {describe, expect, it, vi} from "vitest";
import {SearchService} from "../../../dependencies/Search/searchService.js";

describe('get', () => {
    it('Should return null when first text is empty', async () => {
        const fakeAccountService = {
            findUserByCriteria: vi.fn()
        };
        const service = new SearchService(fakeAccountService as any);
        await expect(service.get('', 'Harris')).resolves.toBe(null);
        expect(fakeAccountService.findUserByCriteria).not.toHaveBeenCalled();
    });

    it('Should return null when last text contains only whitespaces', async () => {
        const fakeAccountService = {
            findUserByCriteria: vi.fn()
        };
        const service = new SearchService(fakeAccountService as any);
        await expect(service.get('Max', '   ')).resolves.toBe(null);
        expect(fakeAccountService.findUserByCriteria).not.toHaveBeenCalled();
    });

    it('Should return null when texts are not strings', async () => {
        const fakeAccountService = {
            findUserByCriteria: vi.fn()
        };
        const service = new SearchService(fakeAccountService as any);
        await expect(service.get(1 as any, 2 as any)).resolves.toBe(null);
        expect(fakeAccountService.findUserByCriteria).not.toHaveBeenCalled();
    });

    it('Should return null when accounts not found', async () => {
        const fakeAccountService = {
            findUserByCriteria: vi.fn().mockResolvedValue(null)
        };
        const service = new SearchService(fakeAccountService as any);
        await expect(service.get('Max', 'Harris')).resolves.toBe(null);
        expect(fakeAccountService.findUserByCriteria).toHaveBeenCalledWith('Max', 'Harris');
    });

    it('Should return found accounts', async () => {
        const rows = [{id: 5, fullName: 'Max Harris'}];
        const fakeAccountService = {
            findUserByCriteria: vi.fn().mockResolvedValue(rows)
        };
        const service = new SearchService(fakeAccountService as any);
        await expect(service.get('Max', 'Harris')).resolves.toBe(rows);
    });

    it('Should rethrow account service error', async () => {
        const fakeAccountService = {
            findUserByCriteria: vi.fn().mockRejectedValue(new Error('Database down'))
        };
        const service = new SearchService(fakeAccountService as any);
        await expect(service.get('Max', 'Harris')).rejects.toThrow('Database down');
    });
});
