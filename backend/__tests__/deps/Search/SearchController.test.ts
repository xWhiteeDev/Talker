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
    it('Should call next with unauthorised when currentUser is missing', async () => {
        const http = createHttpMock({currentUser: undefined, query: {criteria: 'Max Harris'}}) as any;
        const controller = new SearchController({} as any);
        const result = await controller.getByCriteria(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Unauthorised'}));
        expect(result).toBe(false);
    });

    it('Should call next with unauthorized when currentUser id is not a number', async () => {
        const http = createHttpMock({currentUser: {id: '3'}, query: {criteria: 'Max Harris'}}) as any;
        const controller = new SearchController({} as any);
        await controller.getByCriteria(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Unauthorized'}));
    });

    it('Should call next with an error when criteria is missing', async () => {
        const http = createHttpMock({currentUser: {id: 3}, query: {}}) as any;
        const controller = new SearchController({} as any);
        await controller.getByCriteria(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Parameters fault'}));
    });

    it('Should call next with an error when criteria contains only whitespaces', async () => {
        const http = createHttpMock({currentUser: {id: 3}, query: {criteria: '   '}}) as any;
        const controller = new SearchController({} as any);
        await controller.getByCriteria(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Parameters fault'}));
    });

    it('Should return status 400 when criteria has only one word', async () => {
        const fakeService = {
            get: vi.fn()
        };
        const http = createHttpMock({currentUser: {id: 3}, query: {criteria: 'Max'}}) as any;
        const controller = new SearchController(fakeService as any);
        const result = await controller.getByCriteria(http.req, http.res, http.next);
        expect(http.res.status).toHaveBeenCalledWith(400);
        expect(http.res.json).toHaveBeenCalledWith({success: false, data: undefined});
        expect(fakeService.get).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should return success false when nothing found', async () => {
        const fakeService = {
            get: vi.fn().mockResolvedValue([])
        };
        const http = createHttpMock({currentUser: {id: 3}, query: {criteria: 'Max Harris'}}) as any;
        const controller = new SearchController(fakeService as any);
        const result = await controller.getByCriteria(http.req, http.res, http.next);
        expect(fakeService.get).toHaveBeenCalledWith('Max', 'Harris');
        expect(http.res.json).toHaveBeenCalledWith({success: false, data: undefined});
        expect(result).toBe(false);
    });

    it('Should return found accounts when succeed', async () => {
        const rows = [{id: 5, fullName: 'Max Harris'}];
        const fakeService = {
            get: vi.fn().mockResolvedValue(rows)
        };
        const http = createHttpMock({currentUser: {id: 3}, query: {criteria: 'Max Harris'}}) as any;
        const controller = new SearchController(fakeService as any);
        const result = await controller.getByCriteria(http.req, http.res, http.next);
        expect(http.res.status).toHaveBeenCalledWith(201);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: rows});
        expect(result).toBe(true);
    });

    it('Should pass service error to next', async () => {
        const fakeService = {
            get: vi.fn().mockRejectedValue(new Error('Database down'))
        };
        const http = createHttpMock({currentUser: {id: 3}, query: {criteria: 'Max Harris'}}) as any;
        const controller = new SearchController(fakeService as any);
        await controller.getByCriteria(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Database down'}));
    });
});
