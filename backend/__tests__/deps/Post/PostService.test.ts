import {describe, vi, it, expect} from "vitest";
import {PostService} from "../../../dependencies/Post/postService.js";

type TPostVisibility = 'Public' | 'Friends' | 'Private';
interface IMockedPostRowProps {
    id: number;
    authorId: number;
    visible_for?: TPostVisibility;
}

interface IMockedPostRow extends IMockedPostRowProps {
    createdAt: string,
    content: string,
    fullName: string,
    reactions: Record<string, number>,
    myReaction: string,
    commentsCount: number,
    photo: string | null,
    video: string | null,
    file: string | null,
    gif: string | null,
    taggedUsers: string | null,
    pinnedPlace: string | null;
}
/**
 * Function mocks an post row objects
 * @param propsToMock 
 * @returns Mocked post row
 */
function mockPostRow(propsToMock: IMockedPostRowProps): IMockedPostRow {
    return {
        id: propsToMock.id,
        createdAt: "01/01/1970",
        authorId: propsToMock.authorId,
        content: "Mocked content",
        visible_for: propsToMock.visible_for ?? 'Public',
        fullName: "JSON Mock",
        reactions: {'like': 20, 'love': 10, 'wow': 30},
        myReaction: "like",
        commentsCount: 0,
        photo: null,
        video: null,
        file: null,
        gif: null,
        taggedUsers: null,
        pinnedPlace: null
    };
}

describe('findById', () => {
    it('Should pass when every provided argument are exactly same as in dependant functions', async () => {
        const fakePostRow = mockPostRow({
            id: 2,
            authorId: 3,
        });
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(fakePostRow)
        } as any;
        const fakeFriendsService = {
            findRelationBetween: vi.fn()
        } as any;
        const service = new PostService(fakePostRepository, fakeFriendsService, {} as any);
        const result = await service.findById(2, 3, false);
        expect(fakePostRepository.findById).toHaveBeenCalledWith(3, 2);
        expect(fakeFriendsService.findRelationBetween).not.toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({id: 2, authorId: 3}));
    });
    it('Should throw an err when specific post not exist', async () => {
        const fakePostRepository = {
            findById: vi.fn().mockRejectedValue(new Error('Post does not exist'))
        } as any;
        const service = new PostService(fakePostRepository, {} as any, {} as any);
        await expect(service.findById(1, 2)).rejects.toThrow('Post does not exist');
    });
    it('Should return null when post exist but users dont have any relation', async () => {
        const fakePostRow = mockPostRow({
            id: 2,
            authorId: 3,
            visible_for: 'Friends'
        });
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(fakePostRow)
        } as any;
        const fakeFriendsService = {
            findRelationBetween: vi.fn().mockResolvedValue(false)
        };
        const service = new PostService(fakePostRepository, fakeFriendsService as any, {} as any);
        const result = await service.findById(1, 2);
        expect(fakeFriendsService.findRelationBetween).toHaveBeenCalledWith(1, 3, 'accepted');
        expect(result).toBe(null);
    });

    it('Should return post when user is author', async () => {
        const fakePostRow = mockPostRow({
            id: 2,
            authorId: 3,
            visible_for: 'Private'
        });
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(fakePostRow)
        } as any;
        const fakeFriendsService = {
            findRelationBetween: vi.fn()
        };
        const service = new PostService(fakePostRepository, fakeFriendsService as any, {} as any);
        const result = await service.findById(3, 3, true);
        expect(fakeFriendsService.findRelationBetween).not.toHaveBeenCalled();
        expect(result).toBe(fakePostRow);
    });
});

describe('findLatestPosts', () => {
    it('Should pass when every provided argument are exactly same as in dependant function', async () => {
        const mockedRow = mockPostRow({id: 1, authorId: 3});
        const fakePostRepository = {
            findAll: vi.fn().mockResolvedValue([mockedRow])
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        const result = await service.findLatestPosts(3);
        expect(result).toContainEqual(expect.objectContaining({authorId: 3}));
    });

    it('Should return null user not have latest posts', async () => {
        const fakePostRepository = {
            findAll: vi.fn().mockResolvedValue(null)
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        const result = await service.findLatestPosts(3);
        expect(result).toBe(null);
    });
});

