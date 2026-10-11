import {describe, expect, it, vi} from "vitest";
import {ProfileController} from "../../../dependencies/Profile#1/profileController.js";

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

describe('getUser', () => {
    it('Should call next with unauthorised when currentUser is missing', async () => {
        const http = createHttpMock({currentUser: undefined, params: {id: '5'}}) as any;
        const controller = new ProfileController({} as any);
        const result = await controller.getUser(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Unauthorised'}));
        expect(result).toBe(false);
    });

    it('Should call next with an error when id param is missing', async () => {
        const fakeService = {
            get: vi.fn()
        };
        const http = createHttpMock({currentUser: {id: 3}, params: {}}) as any;
        const controller = new ProfileController(fakeService as any);
        await controller.getUser(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Failed to get id property.'}));
        expect(fakeService.get).not.toHaveBeenCalled();
    });

    it('Should return status 200 with profile when succeed', async () => {
        const profile = {fullName: 'Max Harris'};
        const fakeService = {
            get: vi.fn().mockResolvedValue(profile)
        };
        const http = createHttpMock({currentUser: {id: 3}, params: {id: '5'}}) as any;
        const controller = new ProfileController(fakeService as any);
        const result = await controller.getUser(http.req, http.res, http.next);
        expect(fakeService.get).toHaveBeenCalledWith(3, 5);
        expect(http.res.status).toHaveBeenCalledWith(200);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: profile});
        expect(result).toBe(true);
    });

    it('Should pass service error to next', async () => {
        const fakeService = {
            get: vi.fn().mockRejectedValue(new Error('Account not found'))
        };
        const http = createHttpMock({currentUser: {id: 3}, params: {id: '5'}}) as any;
        const controller = new ProfileController(fakeService as any);
        const result = await controller.getUser(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Account not found'}));
        expect(result).toBe(false);
    });
});

describe('getMe', () => {
    it('Should call next with unauthorised when currentUser is missing', async () => {
        const http = createHttpMock({currentUser: undefined}) as any;
        const controller = new ProfileController({} as any);
        const result = await controller.getMe(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Unauthorised'}));
        expect(result).toBe(false);
    });

    it('Should request profile of current user', async () => {
        const profile = {fullName: 'Max Harris'};
        const fakeService = {
            get: vi.fn().mockResolvedValue(profile)
        };
        const http = createHttpMock({currentUser: {id: 3}}) as any;
        const controller = new ProfileController(fakeService as any);
        const result = await controller.getMe(http.req, http.res, http.next);
        expect(fakeService.get).toHaveBeenCalledWith(3, 3);
        expect(http.res.status).toHaveBeenCalledWith(200);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: profile});
        expect(result).toBe(true);
    });

    it('Should pass service error to next', async () => {
        const fakeService = {
            get: vi.fn().mockRejectedValue(new Error('Account not found'))
        };
        const http = createHttpMock({currentUser: {id: 3}}) as any;
        const controller = new ProfileController(fakeService as any);
        await controller.getMe(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Account not found'}));
    });
});
