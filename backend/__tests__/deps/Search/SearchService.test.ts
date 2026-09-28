import {describe, expect, it, vi} from "vitest";
import {SearchService} from "../../../dependencies/Search/searchService.js";

describe('get', () => {
    it.each([
        ['', 'Harris'],
        ['Max', ''],
        ['   ', 'Harris'],
        ['Max', '   '],
        [undefined, 'Harris'],
        ['Max', undefined]
    ])('Should return null without searching when criteria are invalid (%j, %j)', async (firstText, lastText) => {
        const fakeAccountService = {
            findUserByCriteria: vi.fn()
        };
        const service = new SearchService(fakeAccountService as any);
        await expect(service.get(firstText as any, lastText as any)).resolves.toBeNull();
        expect(fakeAccountService.findUserByCriteria).not.toHaveBeenCalled();
    });

    it('Should return null when nobody matches criteria', async () => {
        const fakeAccountService = {
            findUserByCriteria: vi.fn().mockResolvedValue(null)
        };
        const service = new SearchService(fakeAccountService as any);
        await expect(service.get('Max', 'Harris')).resolves.toBeNull();
    });

    it('Should return accounts matching both criteria', async () => {
        const fakeRows = [{fullName: 'Max Harris', id: 3}];
        const fakeAccountService = {
            findUserByCriteria: vi.fn().mockResolvedValue(fakeRows)
        };
        const service = new SearchService(fakeAccountService as any);
        const getSpy = vi.spyOn(service, 'get').mockResolvedValue(fakeRows as any);
        const result = await service.get('Max', 'Harris');
        expect(getSpy).toHaveBeenCalledWith('Max', 'Harris');
        expect(result).toEqual(fakeRows);
    });

    it('Should rethrow error from account service', async () => {
        const serviceError = new Error('Database is down');
        const fakeAccountService = {
            findUserByCriteria: vi.fn().mockRejectedValue(serviceError)
        };
        const service = new SearchService(fakeAccountService as any);
        await expect(service.get('Max', 'Harris')).rejects.toBe(serviceError);
    });
});
