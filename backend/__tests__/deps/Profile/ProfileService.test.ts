import {describe, expect, it, vi} from "vitest";
import {ProfileService} from "../../../dependencies/Profile/profileService.js";

const fakeAccountRow = {
    id: 2,
    firstName: 'Max',
    lastName: 'Harris',
    birthdayDate: '11/02/2000',
    created_at: '21/09/2026',
    email: 'max@proton.me',
    password: 'hashed-password'
};
const fakePosts = [{id: 1, authorId: 2, content: 'Hello'}];
const fakeFriends = [{otherUserId: 5, fullName: 'Calvin Harris', id: 10}];

describe('get', () => {
    it('Should throw an error when user id is not provided', async () => {
        const service = new ProfileService({} as any, {} as any, {} as any);
        await expect(service.get(undefined as any, 2)).rejects.toThrow('User ID not provided');
    });

    it('Should throw an error when user id is not a number', async () => {
        const service = new ProfileService({} as any, {} as any, {} as any);
        await expect(service.get('1' as any, 2)).rejects.toThrow('User ID must be a number');
    });

    it('Should throw an error when requested id is negative', async () => {
        const service = new ProfileService({} as any, {} as any, {} as any);
        await expect(service.get(1, -2)).rejects.toThrow('RequestId cannot be a value which is not a number!');
    });

    it('Should throw an error when requested id is not a number', async () => {
        const service = new ProfileService({} as any, {} as any, {} as any);
        await expect(service.get(1, 'abc' as any)).rejects.toThrow('RequestId cannot be a value which is not a number!');
    });

    it('Should return own profile without relation', async () => {
        const fakeAccountService = {
            findUserById: vi.fn().mockResolvedValue(fakeAccountRow)
        };
        const fakePostService = {
            findByAuthor: vi.fn().mockResolvedValue(fakePosts)
        };
        const fakeFriendshipService = {
            findRelationBetween: vi.fn(),
            findAllAcceptedRelations: vi.fn().mockResolvedValue(fakeFriends)
        };
        const service = new ProfileService(fakeAccountService as any, fakePostService as any, fakeFriendshipService as any);
        const result = await service.get(2, 2);
        expect(fakePostService.findByAuthor).toHaveBeenCalledWith(2, 2);
        expect(fakeAccountService.findUserById).toHaveBeenCalledWith(2);
        expect(fakeFriendshipService.findAllAcceptedRelations).toHaveBeenCalledWith(2);
        expect(fakeFriendshipService.findRelationBetween).not.toHaveBeenCalled();
        expect(result).toEqual({
            fullName: 'Max Harris',
            birthdayDate: '11/02/2000',
            joinDate: '21/09/2026',
            description: 'My hardcoded description',
            content: fakePosts,
            relation: null,
            friends: fakeFriends
        });
    });

    it('Should return profile of other user together with relation', async () => {
        const fakeAccountService = {
            findUserById: vi.fn().mockResolvedValue(fakeAccountRow)
        };
        const fakePostService = {
            findByAuthor: vi.fn().mockResolvedValue(fakePosts)
        };
        const fakeFriendshipService = {
            findRelationBetween: vi.fn().mockResolvedValue({id: 4, userId: 1, friendId: 2, status: 'pending'}),
            findAllAcceptedRelations: vi.fn().mockResolvedValue(fakeFriends)
        };
        const service = new ProfileService(fakeAccountService as any, fakePostService as any, fakeFriendshipService as any);
        const result = await service.get(1, 2);
        expect(fakePostService.findByAuthor).toHaveBeenCalledWith(1, 2);
        expect(fakeFriendshipService.findRelationBetween).toHaveBeenCalledWith(1, 2);
        expect(fakeFriendshipService.findAllAcceptedRelations).toHaveBeenCalledWith(2);
        expect(fakeAccountService.findUserById).toHaveBeenCalledWith(2);
        expect(result.relation).toEqual({status: 'pending', creator: 1});
        expect(result.fullName).toBe('Max Harris');
        expect(result.content).toBe(fakePosts);
        expect(result.friends).toBe(fakeFriends);
    });

    it('Should return null relation when users are not related', async () => {
        const fakeAccountService = {
            findUserById: vi.fn().mockResolvedValue(fakeAccountRow)
        };
        const fakePostService = {
            findByAuthor: vi.fn().mockResolvedValue([])
        };
        const fakeFriendshipService = {
            findRelationBetween: vi.fn().mockResolvedValue(null),
            findAllAcceptedRelations: vi.fn().mockResolvedValue(null)
        };
        const service = new ProfileService(fakeAccountService as any, fakePostService as any, fakeFriendshipService as any);
        const result = await service.get(1, 2);
        expect(result.relation).toBeNull();
        expect(result.friends).toBeNull();
    });

    it('Should throw 404 when requested account does not exist', async () => {
        const fakeAccountService = {
            findUserById: vi.fn().mockResolvedValue(null)
        };
        const fakePostService = {
            findByAuthor: vi.fn().mockResolvedValue([])
        };
        const fakeFriendshipService = {
            findRelationBetween: vi.fn().mockResolvedValue(null),
            findAllAcceptedRelations: vi.fn().mockResolvedValue(null)
        };
        const service = new ProfileService(fakeAccountService as any, fakePostService as any, fakeFriendshipService as any);
        await expect(service.get(1, 2)).rejects.toEqual(expect.objectContaining({message: 'Account not found', code: 404}));
    });

    it('Should rethrow error from dependant service', async () => {
        const serviceError = new Error('Database is down');
        const fakeAccountService = {
            findUserById: vi.fn()
        };
        const fakePostService = {
            findByAuthor: vi.fn().mockRejectedValue(serviceError)
        };
        const fakeFriendshipService = {
            findRelationBetween: vi.fn().mockResolvedValue(null),
            findAllAcceptedRelations: vi.fn().mockResolvedValue(null)
        };
        const service = new ProfileService(fakeAccountService as any, fakePostService as any, fakeFriendshipService as any);
        await expect(service.get(1, 2)).rejects.toBe(serviceError);
        expect(fakeAccountService.findUserById).not.toHaveBeenCalled();
    });
});
