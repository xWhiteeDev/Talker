import {describe, expect, it, vi} from "vitest";
import {SearchController} from "../../../dependencies/Search/searchController.js";

function createHttpMock(overrides: {}) {
    return {
        req: {...overrides},
        res: {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        },
        next: vi.fn()
    };
}

describe('getByCriteria', () => {
    it('Should pass unauthorised error to next when user is not logged in', async () => {
        const fakeSearchService = {
            get: vi.fn()
        };
        const controller = new SearchController(fakeSearchService as any);
        const http = createHttpMock({currentUser: undefined, query: {criteria: 'Max Harris'}}) as any;
        const result = await controller.getByCriteria(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Unauthorised', code: 401}));
        expect(fakeSearchService.get).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should pass unauthorized error to next when user id is not a number', async () => {
        const fakeSearchService = {
            get: vi.fn()
        };
        const controller = new SearchController(fakeSearchService as any);
        const http = createHttpMock({currentUser: {id: '3'}, query: {criteria: 'Max Harris'}}) as any;
        await controller.getByCriteria(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Unauthorized', code: 401}));
        expect(fakeSearchService.get).not.toHaveBeenCalled();
    });

    it('Should pass error to next when criteria is missing', async () => {
        const fakeSearchService = {
            get: vi.fn()
        };
        const controller = new SearchController(fakeSearchService as any);
        const http = createHttpMock({currentUser: {id: 3}, query: {}}) as any;
        const result = await controller.getByCriteria(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Parameters fault', code: 400}));
        expect(fakeSearchService.get).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should pass error to next when criteria is blank', async () => {
        const fakeSearchService = {
            get: vi.fn()
        };
        const controller = new SearchController(fakeSearchService as any);
        const http = createHttpMock({currentUser: {id: 3}, query: {criteria: '   '}}) as any;
        await controller.getByCriteria(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Parameters fault', code: 400}));
        expect(fakeSearchService.get).not.toHaveBeenCalled();
    });

    it('Should return status 400 when criteria has only one word', async () => {
        const fakeSearchService = {
            get: vi.fn()
        };
        const controller = new SearchController(fakeSearchService as any);
        const http = createHttpMock({currentUser: {id: 3}, query: {criteria: 'Max'}}) as any;
        const result = await controller.getByCriteria(http.req, http.res, http.next);
        expect(http.res.status).toHaveBeenCalledWith(400);
        expect(http.res.json).toHaveBeenCalledWith({success: false, data: undefined});
        expect(fakeSearchService.get).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should return success false when nobody was found', async () => {
        const fakeSearchService = {
            get: vi.fn().mockResolvedValue([])
        };
        const controller = new SearchController(fakeSearchService as any);
        const http = createHttpMock({currentUser: {id: 3}, query: {criteria: 'Max Harris'}}) as any;
        const result = await controller.getByCriteria(http.req, http.res, http.next);
        expect(http.res.status).toHaveBeenCalledWith(201);
        expect(http.res.json).toHaveBeenCalledWith({success: false, data: undefined});
        expect(result).toBe(false);
    });

    it('Should split criteria into first and last text and return found accounts', async () => {
        const fakeRows = [{fullName: 'Max Harris', id: 5}];
        const fakeSearchService = {
            get: vi.fn().mockResolvedValue(fakeRows)
        };
        const controller = new SearchController(fakeSearchService as any);
        const http = createHttpMock({currentUser: {id: 3}, query: {criteria: 'Max Harris'}}) as any;
        const result = await controller.getByCriteria(http.req, http.res, http.next);
        expect(fakeSearchService.get).toHaveBeenCalledWith('Max', 'Harris');
        expect(http.res.status).toHaveBeenCalledWith(201);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: fakeRows});
        expect(result).toBe(true);
    });

    it('Should pass service error to next', async () => {
        const serviceError = new Error('Database is down');
        const fakeSearchService = {
            get: vi.fn().mockRejectedValue(serviceError)
        };
        const controller = new SearchController(fakeSearchService as any);
        const http = createHttpMock({currentUser: {id: 3}, query: {criteria: 'Max Harris'}}) as any;
        const result = await controller.getByCriteria(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(serviceError);
        expect(result).toBe(false);
    });
});
