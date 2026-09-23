import {describe, expect, it, vi} from "vitest";
import {AuthService} from "../../../dependencies/Auth/authService.js";
import type {ILogin} from "../../../dependencies/Auth/types.js";
import bcrypt from "bcryptjs";
import {afterEach, beforeEach} from "vitest";
import jwt, {type JwtPayload} from 'jsonwebtoken';
import type {IAccountInsertDTO, IAccountService} from "../../../dependencies/Account/types.js";

describe('signIn', () => {
    beforeEach(() => {
        vi.stubEnv('TALKER_SERVER_JWT_ACCESS_SECRET', 'test-access-scrt');
        vi.stubEnv('TALKER_SERVER_JWT_REFRESH_SECRET', 'test-refresh-scrt');
    });
    afterEach(() => {
        vi.unstubAllEnvs();
    });
    it('should return invalid data when user not found', async () => {
        const fakeAccountService = {
            findUserWithCredentials: vi.fn().mockResolvedValue(null)
        };
        const loginPayload: ILogin = {
            email: "test57@proton.me",
            password: "4441122"
        };
        const service = new AuthService(fakeAccountService as any);
        await expect(service.signIn(loginPayload)).rejects.toThrow('Invalid data');
    });
    it('should return invalid data when password wrong', async () => {
        const password = await bcrypt.hash('123456', 4);
        const fakeAccountService = {
            findUserWithCredentials: vi.fn().mockResolvedValue({
                id: 1,
                email: 'test57@proton.me',
                password: password
            })
        };
        const loginPayload: ILogin = {
            email: "test57@proton.me",
            password: "4441122"
        };
        const service = new AuthService(fakeAccountService as any);
        await expect(service.signIn(loginPayload)).rejects.toThrow('Invalid data');
    });
    it('should return user data when everything ok', async () => {
        const fakeLogin: ILogin = {
            email: 'test123@proton.me',
            password: '123456'
        };
        const hashedPassword = await bcrypt.hash(fakeLogin.password, 4);

        const fakeExpectedAccountRow = {
            id: 1,
            firstName: "JSON",
            lastName: "String",
            birthdayDate: "11/04/2000",
            created_at: "21/09/2026",
            email: "test123@proton.me",
            password: hashedPassword
        };
        const fakeAccountService: Partial<IAccountService> = {
            findUserWithCredentials: vi.fn().mockResolvedValue(fakeExpectedAccountRow)
        };
        const authService = new AuthService(fakeAccountService as any);
        const operation = await authService.signIn(fakeLogin);
        const access = jwt.verify(operation!.access, 'test-access-scrt') as any;
        const refresh = jwt.verify(operation!.refresh, 'test-refresh-scrt') as any;
        expect(access).toMatchObject({id: 1, tokenType: 'access'});
        expect(refresh).toMatchObject({id: 1, tokenType: 'refresh'});
        const fakeExpectedUser = {
            username: "JSON String",
            birthDate: "11/04/2000",
            joinedAt: "21/09/2026",
            email: "test123@proton.me",
            id: 1,
        };
        expect(operation).toMatchObject(fakeExpectedUser);
    });

});
describe('signUp', () => {
    it('should return false when operation failed ', async () => {
        const fakeRegisterData: IAccountInsertDTO = {
            email: "test123@proton.me",
            password: "1234567",
            birthdayDate: "10/01/2003",
            firstName: "Mike",
            lastName: "Yellow"
        };
        const fakeAccountService = {
            insertUser: vi.fn().mockResolvedValue(false)
        };
        const service = new AuthService(fakeAccountService as any);
        await expect(service.signUp(fakeRegisterData)).resolves.toBe(false);
    });
    it('should return true when everything ok', async () => {
        const fakeRegisterData: IAccountInsertDTO = {
            email: "test123@proton.me",
            password: "1234567",
            birthdayDate: "10/01/2003",
            firstName: "Mike",
            lastName: "Yellow"
        };
        const fakeAccountService = {
            insertUser: vi.fn().mockResolvedValue(true)
        };
        const service = new AuthService(fakeAccountService as any);
        await expect(service.signUp(fakeRegisterData)).resolves.toBe(true);
    });
});

describe('isAuthorized', () => {
    it('should return null when user is not exist', async () => {
        const fakeAccService = {
            findUserById: vi.fn().mockResolvedValue(null)
        };
        const service = new AuthService(fakeAccService as any);
        await expect(service.isAuthorized(1)).resolves.toBeNull();
    });
    it('should return user info object when everything ok', async () => {
        const fakeResolvedAccountRow = {
            id: 1,
            firstName: "JSON",
            lastName: "String",
            birthdayDate: "11/11/2001",
            created_at: "21/09/2026",
            email: "test123a@proton.me",
            password: "1234"
        };
        const fakeAccService = {
            findUserById: vi.fn().mockResolvedValue(fakeResolvedAccountRow)
        };
        const service = new AuthService(fakeAccService as any);
        await expect(service.isAuthorized(1)).resolves.toMatchObject({
            username: `JSON String`,
            birthDate: '11/11/2001',
            joinedAt: '21/09/2026',
            email: 'test123a@proton.me',
            id: 1,
        });
    });
});


describe('signNewToken', () => {
    beforeEach(() => {
        vi.stubEnv('TALKER_SERVER_JWT_ACCESS_SECRET', 'test-access-scrt');
        vi.stubEnv('TALKER_SERVER_JWT_REFRESH_SECRET', 'test-refresh-scrt');
    });
    afterEach(() => {
        vi.unstubAllEnvs();
    });
    it('should test be passed when access token is signed by access', () => {
        const service = new AuthService({} as any);
        const token = service.signNewToken(1, 'access');
        const verification = jwt.verify(token, 'test-access-scrt');
        expect(verification).toMatchObject({id: 1, tokenType: 'access'});
    });
    it('should test failed when refresh token is verified by access secret', () => {
        const service = new AuthService({} as any);
        const token = service.signNewToken(1, 'refresh');
        expect(() => jwt.verify(token, 'test-access-scrt')).toThrow();
    });

    it('should test be passed when refresh token is signed by refresh', () => {
        const service = new AuthService({} as any);
        const token = service.signNewToken(1, 'refresh');
        const verification = jwt.verify(token, 'test-refresh-scrt');
        expect(verification).toMatchObject({id: 1, tokenType: 'refresh'});
    });
    it('should test failed when access token is verified by refresh secret', () => {
        const service = new AuthService({} as any);
        const token = service.signNewToken(1, 'access');
        expect(() => jwt.verify(token, 'test-refresh-scrt')).toThrow();
    });
    it('should be test passed when time diff is same as both of tokens expiriations', () => {
        const service = new AuthService({} as any);
        const accessToken = service.signNewToken(1, 'access');
        const verifiedAccessToken = jwt.verify(accessToken, 'test-access-scrt') as JwtPayload;
        const refreshToken = service.signNewToken(1, 'refresh');
        const verifiedRefreshToken = jwt.verify(refreshToken, 'test-refresh-scrt') as JwtPayload;
        expect(verifiedAccessToken.exp! - verifiedAccessToken.iat!).toBe(300);
        expect(verifiedRefreshToken.exp! - verifiedRefreshToken.iat!).toBe(604800);
    });
});