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

    it('Should throw 404 when repository does not find post', async () => {
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(undefined)
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        await expect(service.findById(1, 2)).rejects.toEqual(expect.objectContaining({message: 'Post does not exist', code: 404}));
    });

    it('Should ask repository for details when withComments is true', async () => {
        const fakePostRow = mockPostRow({id: 7, authorId: 4});
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(fakePostRow)
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        await service.findById(2, 7, true);
        expect(fakePostRepository.findById).toHaveBeenCalledWith(7, 2, true);
    });

    it('Should return post visible for friends when users are friends', async () => {
        const fakePostRow = mockPostRow({
            id: 2,
            authorId: 3,
            visible_for: 'Friends'
        });
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(fakePostRow)
        };
        const fakeFriendsService = {
            findRelationBetween: vi.fn().mockResolvedValue({id: 1, userId: 1, friendId: 3, status: 'accepted'})
        };
        const service = new PostService(fakePostRepository as any, fakeFriendsService as any, {} as any);
        const result = await service.findById(1, 2);
        expect(fakeFriendsService.findRelationBetween).toHaveBeenCalledWith(1, 3, 'accepted');
        expect(result).toBe(fakePostRow);
    });

    it('Should return null when post is private and user is not the author', async () => {
        const fakePostRow = mockPostRow({
            id: 2,
            authorId: 3,
            visible_for: 'Private'
        });
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(fakePostRow)
        };
        const fakeFriendsService = {
            findRelationBetween: vi.fn()
        };
        const service = new PostService(fakePostRepository as any, fakeFriendsService as any, {} as any);
        const result = await service.findById(1, 2);
        expect(fakeFriendsService.findRelationBetween).not.toHaveBeenCalled();
        expect(result).toBe(null);
    });
});

describe('findByAuthor', () => {
    it('Should pass user id and author id to repository and return its result', async () => {
        const fakeRows = [mockPostRow({id: 1, authorId: 3}), mockPostRow({id: 2, authorId: 3})];
        const fakePostRepository = {
            findByAuthor: vi.fn().mockResolvedValue(fakeRows)
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        const result = await service.findByAuthor(1, 3);
        expect(fakePostRepository.findByAuthor).toHaveBeenCalledWith(1, 3);
        expect(result).toBe(fakeRows);
    });
});

describe('insertPost', () => {
    const fakeInsertData = {
        authorId: 3,
        content: 'Mocked content',
        visible_for: 'Public' as const
    };

    it('Should throw an error when author does not exist', async () => {
        const fakeAccountService = {
            findUserById: vi.fn().mockResolvedValue(null)
        };
        const fakePostRepository = {
            insert: vi.fn()
        };
        const service = new PostService(fakePostRepository as any, {} as any, fakeAccountService as any);
        await expect(service.insertPost(fakeInsertData)).rejects.toThrow('User not exist');
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
        await expect(service.insertPost(fakeInsertData)).rejects.toThrow('Operation failed');
    });

    it('Should return true when post inserted', async () => {
        const fakeAccountService = {
            findUserById: vi.fn().mockResolvedValue({id: 3})
        };
        const fakePostRepository = {
            insert: vi.fn().mockResolvedValue(true)
        };
        const service = new PostService(fakePostRepository as any, {} as any, fakeAccountService as any);
        await expect(service.insertPost(fakeInsertData)).resolves.toBe(true);
        expect(fakePostRepository.insert).toHaveBeenCalledWith(fakeInsertData);
    });
});

describe('updatePost', () => {
    const fakeUpdateData = {
        content: 'Updated content',
        visible_for: 'Friends' as const
    };

    it('Should throw 404 when post does not exist', async () => {
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(undefined),
            update: vi.fn()
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        await expect(service.updatePost(3, 2, fakeUpdateData)).rejects.toEqual(expect.objectContaining({message: 'Post does not exist', code: 404}));
        expect(fakePostRepository.update).not.toHaveBeenCalled();
    });

    it('Should throw 403 when user is not the author', async () => {
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(mockPostRow({id: 2, authorId: 5})),
            update: vi.fn()
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        await expect(service.updatePost(3, 2, fakeUpdateData)).rejects.toEqual(expect.objectContaining({message: 'Access denied', code: 403}));
        expect(fakePostRepository.update).not.toHaveBeenCalled();
    });

    it('Should throw an error when update failed', async () => {
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(mockPostRow({id: 2, authorId: 3})),
            update: vi.fn().mockResolvedValue(false)
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        await expect(service.updatePost(3, 2, fakeUpdateData)).rejects.toThrow('Operation failed');
    });

    it('Should return true when author updates own post', async () => {
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(mockPostRow({id: 2, authorId: 3})),
            update: vi.fn().mockResolvedValue(true)
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        await expect(service.updatePost(3, 2, fakeUpdateData)).resolves.toBe(true);
        expect(fakePostRepository.findById).toHaveBeenCalledWith(2, 3);
        expect(fakePostRepository.update).toHaveBeenCalledWith(2, fakeUpdateData);
    });
});

describe('deletePost', () => {
    it('Should throw 404 when post does not exist', async () => {
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(undefined),
            delete: vi.fn()
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        await expect(service.deletePost(3, 2)).rejects.toEqual(expect.objectContaining({message: 'Post does not exist', code: 404}));
        expect(fakePostRepository.delete).not.toHaveBeenCalled();
    });

    it('Should throw 403 when user is not the author', async () => {
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(mockPostRow({id: 2, authorId: 5})),
            delete: vi.fn()
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        await expect(service.deletePost(3, 2)).rejects.toEqual(expect.objectContaining({message: 'Access denied', code: 403}));
        expect(fakePostRepository.delete).not.toHaveBeenCalled();
    });

    it('Should throw an error when delete failed', async () => {
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(mockPostRow({id: 2, authorId: 3})),
            delete: vi.fn().mockResolvedValue(false)
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        await expect(service.deletePost(3, 2)).rejects.toThrow('Operation failed');
    });

    it('Should return true when author deletes own post', async () => {
        const fakePostRepository = {
            findById: vi.fn().mockResolvedValue(mockPostRow({id: 2, authorId: 3})),
            delete: vi.fn().mockResolvedValue(true)
        };
        const service = new PostService(fakePostRepository as any, {} as any, {} as any);
        await expect(service.deletePost(3, 2)).resolves.toBe(true);
        expect(fakePostRepository.findById).toHaveBeenCalledWith(2, 3);
        expect(fakePostRepository.delete).toHaveBeenCalledWith(2);
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

