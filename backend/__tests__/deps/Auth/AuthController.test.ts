import {describe, expect, it, vi} from "vitest";
import {AuthController} from "../../../dependencies/Auth/authController.js";
import type {IUser} from "../../../dependencies/Account/types.js";

function createHttpMock(overrides: {}) {
    return {
        req: {...overrides},
        res: {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            cookie: vi.fn()
        },
        next: vi.fn()
    };
}
describe('createUser', () => {
    it('should throw an error when body data is empty', async () => {
        const http = createHttpMock({
            body: {
                data: {}
            }

        }) as any;
        const controller = new AuthController({} as any);
        await controller.createUser(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Failed to create account'}));
    });

    it('should throw an error when insert user goes failed', async () => {
        const http = createHttpMock({
            body: {
                data: {
                    password: 'typepassword',
                    email: 'typeemail1234@proton.me',
                    birthdayDate: '11/09/2001',
                    firstName: 'typeFirstName',
                    lastName: 'typeLastName'
                }
            }

        }) as any;
        const authService = {
            signUp: vi.fn().mockResolvedValue(false)
        };
        const controller = new AuthController(authService as any);
        await controller.createUser(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Failed to create account'}));
    });

    it('should return status code 200 and success true', async () => {
        const http = createHttpMock({
            body: {
                data: {
                    password: 'typepassword',
                    email: 'typeemail1234@proton.me',
                    birthdayDate: '11/09/2001',
                    firstName: 'typeFirstName',
                    lastName: 'typeLastName'
                }
            }

        }) as any;
        const authService = {
            signUp: vi.fn().mockResolvedValue(true)
        };
        const controller = new AuthController(authService as any);
        await controller.createUser(http.req, http.res, http.next);
        expect(http.res.status).toHaveBeenCalledWith(200);
        expect(http.res.json).toHaveBeenCalledWith(expect.objectContaining({success: true}));
    });

});

describe('signIn', () => {
    it('should throw an error when body.data is empty', async () => {
        const http = createHttpMock({
            body: {
                data: {}
            }
        }) as any;
        const controller = new AuthController({} as any);
        await controller.signIn(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Failed to sign in'}));
    });
    it('should throw an error when operation failed', async () => {
        const http = createHttpMock({
            body: {
                data: {email: 'extraEmail@proton.me', password: 'password'}

            }
        }) as any;
        const fakeAuthService = {
            signIn: vi.fn().mockResolvedValue(false)
        };
        const controller = new AuthController(fakeAuthService as any);
        await controller.signIn(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Failed to sign in'}));
    });
    it('should return code 200 and success true when everything ok', async () => {
        const http = createHttpMock({
            body: {
                data: {email: 'extraEmail@proton.me', password: 'password'}
            }
        }) as any;
        const fakeUser: IUser = {
            username: "username",
            birthDate: "01/01/2000",
            joinedAt: "12/01/2026",
            email: "extraEmail@proton.me",
            id: 1,
            access: "fake-access-token",
            refresh: "fake-refresh-token"
        };
        const fakeAuthService = {
            signIn: vi.fn().mockResolvedValue(fakeUser)
        };

        const controller = new AuthController(fakeAuthService as any);
        await controller.signIn(http.req, http.res, http.next);
        expect(http.res.status).toHaveBeenCalledWith(200);
        expect(http.res.cookie).toHaveBeenCalledWith('accessToken', 'fake-access-token', expect.objectContaining({httpOnly: true}));
        expect(http.res.cookie).toHaveBeenCalledWith('refreshToken', 'fake-refresh-token', expect.objectContaining({httpOnly: true}));

        expect(http.res.json).toHaveBeenCalledWith(expect.objectContaining({success: true}));
    });

});

describe('createNewToken', () => {
    it('should throw an error when user is not authorized', () => {
        const http = createHttpMock({
            body: {}
        }) as any;
        const controller = new AuthController({} as any);
        controller.createNewToken(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: "Unauthorized"}));
    });
    it('should return status 200 and success true as json when everything ok', () => {
        const http = createHttpMock({
            body: {},
            currentUser: {id: 1}
        }) as any;
        const fakeAuthService = {
            signNewToken: vi.fn().mockReturnValue('token')
        };
        const controller = new AuthController(fakeAuthService as any);
        controller.createNewToken(http.req, http.res, http.next);
        expect(http.res.status).toHaveBeenCalledWith(200);
        expect(fakeAuthService.signNewToken).toHaveBeenCalledWith(1, 'access');
        expect(http.res.cookie).toHaveBeenCalledWith('accessToken', 'token', expect.objectContaining({httpOnly: true}));
        expect(http.res.json).toHaveBeenCalledWith(expect.objectContaining({success: true}));
    });
});

describe('isAuthorized', () => {
    it('should throw an error when user is not authorized', () => {
        const http = createHttpMock({
            body: {}
        }) as any;
        const controller = new AuthController({} as any);
        controller.isAuthorized(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: "Unauthorized"}));
    });
    it('should throw an error when user is not authorized', async () => {
        const http = createHttpMock({
            body: {},
            currentUser: {id: 1}
        }) as any;
        const fakeAuthService = {
            isAuthorized: vi.fn().mockResolvedValue(null)
        };
        const controller = new AuthController(fakeAuthService as any);
        await controller.isAuthorized(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'User is not authorized'}));
    });
    it('should return status 200 and success true as json when everything ok', async () => {
        const http = createHttpMock({
            body: {},
            currentUser: {id: 1}
        }) as any;
        const fakeAuthService = {
            isAuthorized: vi.fn().mockResolvedValue(true)
        };
        const controller = new AuthController(fakeAuthService as any);
        await controller.isAuthorized(http.req, http.res, http.next);
        expect(http.res.status).toHaveBeenCalledWith(200);
        expect(http.res.json).toHaveBeenCalledWith(expect.objectContaining({success: true}));
    });
});