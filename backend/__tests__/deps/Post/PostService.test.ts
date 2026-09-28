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


describe('findByAuthor', () => {
    it('Should pass userId and authorId to repository and return its result', async () => {
        const mockedRows = [mockPostRow({id: 1, authorId: 5}), mockPostRow({id: 2, authorId: 5})];
        const fakePostRepository = {
            findByAuthor: vi.fn().mockResolvedValue(mockedRows)
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        const result = await service.findByAuthor(3, 5);
        expect(fakePostRepository.findByAuthor).toHaveBeenCalledWith(3, 5);
        expect(result).toBe(mockedRows);
    });

    it('Should return null when author does not have posts', async () => {
        const fakePostRepository = {
            findByAuthor: vi.fn().mockResolvedValue(null)
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        await expect(service.findByAuthor(3, 5)).resolves.toBe(null);
    });
});

describe('insertPost', () => {
    const dto = {authorId: 3, content: 'Hello world', visible_for: 'Public' as const};

    it('Should throw an error when author account does not exist', async () => {
        const fakeAccountService = {
            findUserById: vi.fn().mockResolvedValue(null)
        };
        const fakePostRepository = {
            insert: vi.fn()
        };
        const service = new PostService(fakePostRepository as any, {} as any, fakeAccountService as any);
        await expect(service.insertPost(dto)).rejects.toThrow('User not exist');
        expect(fakeAccountService.findUserById).toHaveBeenCalledWith(3);
        expect(fakePostRepository.insert).not.toHaveBeenCalled();
    });

    it('Should throw an error when insert failed', async () => {
        const fakeAccountService = {
            findUserById: vi.fn().mockResolvedValue({id: 3})
        };
        const fakePostRepository = {
            insert: vi.fn().mockResolvedValue(false)
        };
        const service = new PostService(fakePostRepository as any, {} as any, fakeAccountService as any);
        await expect(service.insertPost(dto)).rejects.toThrow('Operation failed');
    });

    it('Should return true when post inserted', async () => {
        const fakeAccountService = {
            findUserById: vi.fn().mockResolvedValue({id: 3})
        };
        const fakePostRepository = {
            insert: vi.fn().mockResolvedValue(true)
        };
        const service = new PostService(fakePostRepository as any, {} as any, fakeAccountService as any);
        await expect(service.insertPost(dto)).resolves.toBe(true);
        expect(fakePostRepository.insert).toHaveBeenCalledWith(dto);
    });
});

describe('updatePost', () => {
    const dto = {content: 'Updated content', visible_for: 'Friends' as const};

    it('Should throw an error when post does not exist', async () => {
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(undefined),
            update: vi.fn()
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        await expect(service.updatePost(3, 10, dto)).rejects.toThrow('Post does not exist');
        expect(fakePostRepository.findById).toHaveBeenCalledWith(10, 3);
        expect(fakePostRepository.update).not.toHaveBeenCalled();
    });

    it('Should throw access denied when user is not an author', async () => {
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(mockPostRow({id: 10, authorId: 7})),
            update: vi.fn()
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        await expect(service.updatePost(3, 10, dto)).rejects.toThrow('Access denied');
        expect(fakePostRepository.update).not.toHaveBeenCalled();
    });

    it('Should throw an error when update failed', async () => {
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(mockPostRow({id: 10, authorId: 3})),
            update: vi.fn().mockResolvedValue(false)
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        await expect(service.updatePost(3, 10, dto)).rejects.toThrow('Operation failed');
    });

    it('Should return true when post updated', async () => {
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(mockPostRow({id: 10, authorId: 3})),
            update: vi.fn().mockResolvedValue(true)
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        await expect(service.updatePost(3, 10, dto)).resolves.toBe(true);
        expect(fakePostRepository.update).toHaveBeenCalledWith(10, dto);
    });
});

describe('deletePost', () => {
    it('Should throw an error when post does not exist', async () => {
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(undefined),
            delete: vi.fn()
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        await expect(service.deletePost(3, 10)).rejects.toThrow('Post does not exist');
        expect(fakePostRepository.delete).not.toHaveBeenCalled();
    });

    it('Should throw access denied when user is not an author', async () => {
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(mockPostRow({id: 10, authorId: 7})),
            delete: vi.fn()
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        await expect(service.deletePost(3, 10)).rejects.toThrow('Access denied');
        expect(fakePostRepository.delete).not.toHaveBeenCalled();
    });

    it('Should throw an error when delete failed', async () => {
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(mockPostRow({id: 10, authorId: 3})),
            delete: vi.fn().mockResolvedValue(false)
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        await expect(service.deletePost(3, 10)).rejects.toThrow('Operation failed');
    });

    it('Should return true when post deleted', async () => {
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(mockPostRow({id: 10, authorId: 3})),
            delete: vi.fn().mockResolvedValue(true)
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        await expect(service.deletePost(3, 10)).resolves.toBe(true);
        expect(fakePostRepository.delete).toHaveBeenCalledWith(10);
    });
});
