import {describe, expect, it, vi} from "vitest";
import {PostReactionService} from "../../../dependencies/PostReaction/postReactionService.js";
import type {PostReactionInsertDTO} from "../../../dependencies/PostReaction/types.js";
import {ErrorHandler} from "../../../handlers/errorHandler.js";

const fakeReactionRows = [
    {id: 1, author_id: 3, type: 'like', post_id: 7},
    {id: 2, author_id: 4, type: 'love', post_id: 7}
];

describe('findPostReactions', () => {
    it('Should throw an error when post does not have reactions', async () => {
        const fakeRepo = {
            findByPostId: vi.fn().mockResolvedValue([])
        };
        const service = new PostReactionService(fakeRepo as any);
        try {
            await service.findPostReactions(7);
        } catch (error) {
            expect(error).toBeInstanceOf(ErrorHandler);
            expect((error as ErrorHandler).message).toBe('Field not found');
            expect((error as ErrorHandler).code).toBe(400);
        }
    });

    it('Should return reactions of post', async () => {
        const fakeRepo = {
            findByPostId: vi.fn().mockResolvedValue(fakeReactionRows)
        };
        const service = new PostReactionService(fakeRepo as any);
        await expect(service.findPostReactions(7)).resolves.toBe(fakeReactionRows);
        expect(fakeRepo.findByPostId).toHaveBeenCalledWith(7);
    });
});

describe('findPostReactionsByType', () => {
    it('Should throw an error when post does not have reactions of that type', async () => {
        const fakeRepo = {
            findByType: vi.fn().mockResolvedValue([])
        };
        const service = new PostReactionService(fakeRepo as any);
        await expect(service.findPostReactionsByType(7, 'wow')).rejects.toThrow('Field not found');
    });

    it('Should pass type and post id to repository in correct order', async () => {
        const fakeRepo = {
            findByType: vi.fn().mockResolvedValue([fakeReactionRows[0]])
        };
        const service = new PostReactionService(fakeRepo as any);
        const result = await service.findPostReactionsByType(7, 'like');
        expect(fakeRepo.findByType).toHaveBeenCalledWith('like', 7);
        expect(result).toEqual([fakeReactionRows[0]]);
    });
});

describe('findAllUserReactions', () => {
    it('Should throw an error when user does not have reactions', async () => {
        const fakeRepo = {
            findByAuthor: vi.fn().mockResolvedValue([])
        };
        const service = new PostReactionService(fakeRepo as any);
        await expect(service.findAllUserReactions(3)).rejects.toThrow('Field not found');
    });

    it('Should return all reactions of user', async () => {
        const fakeRepo = {
            findByAuthor: vi.fn().mockResolvedValue(fakeReactionRows)
        };
        const service = new PostReactionService(fakeRepo as any);
        await expect(service.findAllUserReactions(3)).resolves.toBe(fakeReactionRows);
        expect(fakeRepo.findByAuthor).toHaveBeenCalledWith(3);
    });
});

describe('findUserReactionInPost', () => {
    it('Should throw an error when user did not react to post', async () => {
        const fakeRepo = {
            findByAuthorInPost: vi.fn().mockResolvedValue(undefined)
        };
        const service = new PostReactionService(fakeRepo as any);
        await expect(service.findUserReactionInPost(3, 7)).rejects.toThrow('Field not found');
    });

    it('Should return reaction of user in post', async () => {
        const fakeRepo = {
            findByAuthorInPost: vi.fn().mockResolvedValue(fakeReactionRows[0])
        };
        const service = new PostReactionService(fakeRepo as any);
        await expect(service.findUserReactionInPost(3, 7)).resolves.toBe(fakeReactionRows[0]);
        expect(fakeRepo.findByAuthorInPost).toHaveBeenCalledWith(3, 7);
    });
});

describe('insertPostReaction', () => {
    const fakeInsertData: PostReactionInsertDTO = {
        authorId: 3,
        type: 'like',
        postId: 7
    };

    it('Should insert reaction when user has not reacted to post yet', async () => {
        const fakeRepo = {
            findByAuthorInPost: vi.fn().mockResolvedValue(undefined),
            delete: vi.fn(),
            insert: vi.fn().mockResolvedValue(true)
        };
        const service = new PostReactionService(fakeRepo as any);
        await expect(service.insertPostReaction(fakeInsertData)).resolves.toBe(true);
        expect(fakeRepo.findByAuthorInPost).toHaveBeenCalledWith(3, 7);
        expect(fakeRepo.insert).toHaveBeenCalledWith(fakeInsertData);
        expect(fakeRepo.delete).not.toHaveBeenCalled();
    });

    it('Should only remove reaction when user sends the same type again', async () => {
        const fakeRepo = {
            findByAuthorInPost: vi.fn().mockResolvedValue({id: 1, author_id: 3, type: 'like', post_id: 7}),
            delete: vi.fn().mockResolvedValue(true),
            insert: vi.fn()
        };
        const service = new PostReactionService(fakeRepo as any);
        await expect(service.insertPostReaction(fakeInsertData)).resolves.toBe(true);
        expect(fakeRepo.delete).toHaveBeenCalledWith(3, 7);
        expect(fakeRepo.insert).not.toHaveBeenCalled();
    });

    it('Should replace reaction when user sends different type', async () => {
        const fakeRepo = {
            findByAuthorInPost: vi.fn().mockResolvedValue({id: 1, author_id: 3, type: 'love', post_id: 7}),
            delete: vi.fn().mockResolvedValue(true),
            insert: vi.fn().mockResolvedValue(true)
        };
        const service = new PostReactionService(fakeRepo as any);
        await expect(service.insertPostReaction(fakeInsertData)).resolves.toBe(true);
        expect(fakeRepo.delete).toHaveBeenCalledWith(3, 7);
        expect(fakeRepo.insert).toHaveBeenCalledWith(fakeInsertData);
    });

    it('Should throw an error when insert failed', async () => {
        const fakeRepo = {
            findByAuthorInPost: vi.fn().mockResolvedValue(undefined),
            delete: vi.fn(),
            insert: vi.fn().mockResolvedValue(false)
        };
        const service = new PostReactionService(fakeRepo as any);
        await expect(service.insertPostReaction(fakeInsertData)).rejects.toThrow('Operation failed');
    });
});

describe('updateReactionType', () => {
    it('Should throw an error when reaction does not exist', async () => {
        const fakeRepo = {
            findById: vi.fn().mockResolvedValue(undefined),
            updateType: vi.fn()
        };
        const service = new PostReactionService(fakeRepo as any);
        await expect(service.updateReactionType(1, 'love')).rejects.toThrow('Field not found');
        expect(fakeRepo.updateType).not.toHaveBeenCalled();
    });

    it('Should throw an error when update failed', async () => {
        const fakeRepo = {
            findById: vi.fn().mockResolvedValue(fakeReactionRows[0]),
            updateType: vi.fn().mockResolvedValue(false)
        };
        const service = new PostReactionService(fakeRepo as any);
        await expect(service.updateReactionType(1, 'love')).rejects.toThrow('Operation failed');
    });

    it('Should return true when type updated', async () => {
        const fakeRepo = {
            findById: vi.fn().mockResolvedValue(fakeReactionRows[0]),
            updateType: vi.fn().mockResolvedValue(true)
        };
        const service = new PostReactionService(fakeRepo as any);
        await expect(service.updateReactionType(1, 'love')).resolves.toBe(true);
        expect(fakeRepo.findById).toHaveBeenCalledWith(1);
        expect(fakeRepo.updateType).toHaveBeenCalledWith(1, 'love');
    });
});

describe('deleteUserReactionInPost', () => {
    it('Should throw an error when user did not react to post', async () => {
        const fakeRepo = {
            findByAuthorInPost: vi.fn().mockResolvedValue(undefined),
            delete: vi.fn()
        };
        const service = new PostReactionService(fakeRepo as any);
        await expect(service.deleteUserReactionInPost(3, 7)).rejects.toThrow('Field not found');
        expect(fakeRepo.delete).not.toHaveBeenCalled();
    });

    it('Should throw an error when delete failed', async () => {
        const fakeRepo = {
            findByAuthorInPost: vi.fn().mockResolvedValue(fakeReactionRows[0]),
            delete: vi.fn().mockResolvedValue(false)
        };
        const service = new PostReactionService(fakeRepo as any);
        await expect(service.deleteUserReactionInPost(3, 7)).rejects.toThrow('Operation failed');
    });

    it('Should return true when reaction deleted', async () => {
        const fakeRepo = {
            findByAuthorInPost: vi.fn().mockResolvedValue(fakeReactionRows[0]),
            delete: vi.fn().mockResolvedValue(true)
        };
        const service = new PostReactionService(fakeRepo as any);
        await expect(service.deleteUserReactionInPost(3, 7)).resolves.toBe(true);
        expect(fakeRepo.findByAuthorInPost).toHaveBeenCalledWith(3, 7);
        expect(fakeRepo.delete).toHaveBeenCalledWith(3, 7);
    });
});
