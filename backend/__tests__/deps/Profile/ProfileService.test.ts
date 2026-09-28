import {describe, expect, it, vi} from "vitest";
import {ProfileService} from "../../../dependencies/Profile/profileService.js";

const fakeAccount = {
    id: 5,
    firstName: 'Max',
    lastName: 'Harris',
    birthdayDate: '11/02/2000',
    created_at: '11/06/2026'
};

/**
 * Creates fake services used by ProfileService
 * @param overrides values returned by each fake service method
 */
function createServices(overrides: {account?: unknown, posts?: unknown, relation?: unknown, friends?: unknown} = {}) {
    return {
        accountService: {
            findUserById: vi.fn().mockResolvedValue('account' in overrides ? overrides.account : fakeAccount)
        },
        postService: {
            findByAuthor: vi.fn().mockResolvedValue(overrides.posts ?? [])
        },
        friendshipService: {
            findRelationBetween: vi.fn().mockResolvedValue(overrides.relation ?? null),
            findAllAcceptedRelations: vi.fn().mockResolvedValue(overrides.friends ?? null)
        }
    };
}

function createProfileService(services: ReturnType<typeof createServices>) {
    return new ProfileService(services.accountService as any, services.postService as any, services.friendshipService as any);
}

describe('get', () => {
    it('Should throw an error when userId is not provided', async () => {
        const service = createProfileService(createServices());
        await expect(service.get(undefined as any, 5)).rejects.toThrow('User ID not provided');
    });

    it('Should throw an error when userId is not a number', async () => {
        const service = createProfileService(createServices());
        await expect(service.get('3' as any, 5)).rejects.toThrow('User ID must be a number');
    });

    it('Should throw an error when requestedId is not a number', async () => {
        const service = createProfileService(createServices());
        await expect(service.get(3, '5' as any)).rejects.toThrow('RequestId cannot be a value which is not a number!');
    });

    it('Should throw an error when requestedId is negative', async () => {
        const service = createProfileService(createServices());
        await expect(service.get(3, -1)).rejects.toThrow('RequestId cannot be a value which is not a number!');
    });

    it('Should throw an error when account not found', async () => {
        const service = createProfileService(createServices({account: null}));
        await expect(service.get(3, 5)).rejects.toThrow('Account not found');
    });

    it('Should not look for relation when user requests own profile', async () => {
        const services = createServices();
        const service = createProfileService(services);
        const result = await service.get(5, 5);
        expect(services.postService.findByAuthor).toHaveBeenCalledWith(5, 5);
        expect(services.accountService.findUserById).toHaveBeenCalledWith(5);
        expect(services.friendshipService.findAllAcceptedRelations).toHaveBeenCalledWith(5);
        expect(services.friendshipService.findRelationBetween).not.toHaveBeenCalled();
        expect(result.relation).toBe(null);
    });

    it('Should look for relation when user requests other profile', async () => {
        const services = createServices({relation: {status: 'pending', userId: 3, friendId: 5}});
        const service = createProfileService(services);
        const result = await service.get(3, 5);
        expect(services.postService.findByAuthor).toHaveBeenCalledWith(3, 5);
        expect(services.friendshipService.findRelationBetween).toHaveBeenCalledWith(3, 5);
        expect(services.friendshipService.findAllAcceptedRelations).toHaveBeenCalledWith(5);
        expect(result.relation).toEqual({status: 'pending', creator: 3});
    });

    it('Should return null relation when users are not in relation', async () => {
        const service = createProfileService(createServices({relation: null}));
        const result = await service.get(3, 5);
        expect(result.relation).toBe(null);
    });

    it('Should map account, posts and friends to profile', async () => {
        const posts = [{id: 1}];
        const friends = [{otherUserId: 7, fullName: 'John Doe'}];
        const service = createProfileService(createServices({posts, friends}));
        const result = await service.get(3, 5);
        expect(result).toEqual({
            fullName: 'Max Harris',
            birthdayDate: '11/02/2000',
            joinDate: '11/06/2026',
            description: expect.any(String),
            content: posts,
            relation: null,
            friends
        });
    });
});
