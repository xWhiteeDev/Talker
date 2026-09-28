import {describe, expect, it, vi} from "vitest";
import {ProfileController} from "../../../dependencies/Profile/profileController.js";
import {ErrorHandler} from "../../../handlers/errorHandler.js";

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

const fakeProfile = {
    fullName: 'Max Harris',
    birthdayDate: '11/02/2000',
    joinDate: '21/09/2026',
    description: 'My hardcoded description',
    content: [],
    relation: null,
    friends: null
};

describe('getUser', () => {
    it('Should pass unauthorised error to next when user is not logged in', async () => {
        const fakeProfileService = {
            get: vi.fn()
        };
        const controller = new ProfileController(fakeProfileService as any);
        const http = createHttpMock({currentUser: undefined, params: {id: '8'}}) as any;
        const result = await controller.getUser(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Unauthorised', code: 401}));
        expect(fakeProfileService.get).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should pass error to next when id param is missing', async () => {
        const fakeProfileService = {
            get: vi.fn()
        };
        const controller = new ProfileController(fakeProfileService as any);
        const http = createHttpMock({currentUser: {id: 3}, params: {}}) as any;
        const result = await controller.getUser(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Failed to get id property.', code: 400}));
        expect(fakeProfileService.get).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should return profile of requested user', async () => {
        const fakeProfileService = {
            get: vi.fn().mockResolvedValue(fakeProfile)
        };
        const controller = new ProfileController(fakeProfileService as any);
        const http = createHttpMock({currentUser: {id: 3}, params: {id: '8'}}) as any;
        const result = await controller.getUser(http.req, http.res, http.next);
        expect(fakeProfileService.get).toHaveBeenCalledWith(3, 8);
        expect(http.res.status).toHaveBeenCalledWith(200);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: fakeProfile});
        expect(result).toBe(true);
    });

    it('Should not pass any error to next when profile was found', async () => {
        const fakeProfileService = {
            get: vi.fn().mockResolvedValue(fakeProfile)
        };
        const controller = new ProfileController(fakeProfileService as any);
        const http = createHttpMock({currentUser: {id: 3}, params: {id: '8'}}) as any;
        controller.getUser(http.req, http.res, http.next);
        expect(fakeProfileService.get).toHaveBeenCalledWith(3, 8);
        expect(http.next).not.toHaveBeenCalled();
    });

    it('Should pass service error to next when account not found', async () => {
        const fakeProfileService = {
            get: vi.fn().mockRejectedValue(new ErrorHandler('Account not found', 404))
        };
        const controller = new ProfileController(fakeProfileService as any);
        const http = createHttpMock({currentUser: {id: 3}, params: {id: '8'}}) as any;
        const result = await controller.getUser(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Account not found', code: 404}));
        expect(http.res.status).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });
});

describe('getMe', () => {
    it('Should pass unauthorised error to next when user is not logged in', async () => {
        const fakeProfileService = {
            get: vi.fn()
        };
        const controller = new ProfileController(fakeProfileService as any);
        const http = createHttpMock({currentUser: undefined}) as any;
        const result = await controller.getMe(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Unauthorised', code: 401}));
        expect(fakeProfileService.get).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should return profile of current user', async () => {
        const fakeProfileService = {
            get: vi.fn().mockResolvedValue(fakeProfile)
        };
        const controller = new ProfileController(fakeProfileService as any);
        const http = createHttpMock({currentUser: {id: 3}}) as any;
        const result = await controller.getMe(http.req, http.res, http.next);
        expect(fakeProfileService.get).toHaveBeenCalledWith(3, 3);
        expect(http.res.status).toHaveBeenCalledWith(200);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: fakeProfile});
        expect(result).toBe(true);
    });

    it('Should pass service error to next', async () => {
        const serviceError = new Error('Database is down');
        const fakeProfileService = {
            get: vi.fn().mockRejectedValue(serviceError)
        };
        const controller = new ProfileController(fakeProfileService as any);
        const http = createHttpMock({currentUser: {id: 3}}) as any;
        const result = await controller.getMe(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(serviceError);
        expect(result).toBe(false);
    });
});
