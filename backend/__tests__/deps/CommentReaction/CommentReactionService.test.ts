import {describe, expect, it, vi} from "vitest";
import {CommentReactionService} from "../../../dependencies/CommentReaction/CommentReactionService.js";
import type {CommentReactionInsertDTO} from "../../../dependencies/CommentReaction/types.js";

const fakeReactionRows = [
    {id: 1, author_id: 3, type: 'like', comment_id: 12, created_at: '2026-09-01 10:00'},
    {id: 2, author_id: 4, type: 'love', comment_id: 12, created_at: '2026-09-01 10:05'}
];

describe('findCommentReactions', () => {
    it('Should throw an error when comment does not have reactions', async () => {
        const fakeRepo = {
            findByCommentId: vi.fn().mockResolvedValue([])
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.findCommentReactions(12)).rejects.toThrow('Field not found');
    });

    it('Should return reactions of comment', async () => {
        const fakeRepo = {
            findByCommentId: vi.fn().mockResolvedValue(fakeReactionRows)
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.findCommentReactions(12)).resolves.toBe(fakeReactionRows);
        expect(fakeRepo.findByCommentId).toHaveBeenCalledWith(12);
    });
});

describe('findCommentReactionsByType', () => {
    it('Should throw an error when comment does not have reactions of that type', async () => {
        const fakeRepo = {
            findByType: vi.fn().mockResolvedValue([])
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.findCommentReactionsByType(12, 'wow')).rejects.toThrow('Field not found');
    });

    it('Should pass type and comment id to repository in correct order', async () => {
        const fakeRepo = {
            findByType: vi.fn().mockResolvedValue([fakeReactionRows[0]])
        };
        const service = new CommentReactionService(fakeRepo as any);
        const result = await service.findCommentReactionsByType(12, 'like');
        expect(fakeRepo.findByType).toHaveBeenCalledWith('like', 12);
        expect(result).toEqual([fakeReactionRows[0]]);
    });
});

describe('findAllUserReactions', () => {
    it('Should throw an error when user does not have reactions', async () => {
        const fakeRepo = {
            findByAuthor: vi.fn().mockResolvedValue([])
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.findAllUserReactions(3)).rejects.toThrow('Field not found');
    });

    it('Should return all reactions of user', async () => {
        const fakeRepo = {
            findByAuthor: vi.fn().mockResolvedValue(fakeReactionRows)
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.findAllUserReactions(3)).resolves.toBe(fakeReactionRows);
        expect(fakeRepo.findByAuthor).toHaveBeenCalledWith(3);
    });
});

describe('findUserReactionInComment', () => {
    it('Should throw an error when user did not react to comment', async () => {
        const fakeRepo = {
            findByAuthorInComment: vi.fn().mockResolvedValue(undefined)
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.findUserReactionInComment(3, 12)).rejects.toThrow('Field not found');
    });

    it('Should return reaction of user in comment', async () => {
        const fakeRepo = {
            findByAuthorInComment: vi.fn().mockResolvedValue(fakeReactionRows[0])
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.findUserReactionInComment(3, 12)).resolves.toBe(fakeReactionRows[0]);
        expect(fakeRepo.findByAuthorInComment).toHaveBeenCalledWith(3, 12);
    });
});

describe('insertCommentReaction', () => {
    const fakeInsertData: CommentReactionInsertDTO = {
        author_id: 3,
        type: 'like',
        comment_id: 12
    };
    const fakeRepo = {
        findByAuthorInComment: vi.fn(),
        delete: vi.fn(),
        insert: vi.fn()
    };
    const service = new CommentReactionService(fakeRepo as any);

    it('Should insert reaction when user has not reacted to comment yet', async () => {
        fakeRepo.findByAuthorInComment.mockResolvedValue(undefined);
        fakeRepo.insert.mockResolvedValue(true);
        await expect(service.insertCommentReaction(fakeInsertData)).resolves.toBe(true);
        expect(fakeRepo.findByAuthorInComment).toHaveBeenCalledWith(3, 12);
        expect(fakeRepo.insert).toHaveBeenCalledWith(fakeInsertData);
        expect(fakeRepo.delete).not.toHaveBeenCalled();
    });

    it('Should only remove reaction when user sends the same type again', async () => {
        fakeRepo.findByAuthorInComment.mockResolvedValue({id: 1, author_id: 3, type: 'like', comment_id: 12});
        fakeRepo.delete.mockResolvedValue(true);
        await expect(service.insertCommentReaction(fakeInsertData)).resolves.toBe(true);
        expect(fakeRepo.delete).toHaveBeenCalledWith(3, 12);
        expect(fakeRepo.insert).not.toHaveBeenCalled();
    });

    it('Should replace reaction when user sends different type', async () => {
        fakeRepo.findByAuthorInComment.mockResolvedValue({id: 1, author_id: 3, type: 'love', comment_id: 12});
        await expect(service.insertCommentReaction(fakeInsertData)).resolves.toBe(true);
        expect(fakeRepo.delete).toHaveBeenCalledWith(3, 12);
        expect(fakeRepo.insert).toHaveBeenCalledWith(fakeInsertData);
    });

    it('Should throw an error when insert failed', async () => {
        fakeRepo.findByAuthorInComment.mockResolvedValue(undefined);
        fakeRepo.insert.mockResolvedValue(false);
        await expect(service.insertCommentReaction(fakeInsertData)).rejects.toThrow('Operation failed');
    });
});

describe('updateReactionType', () => {
    it('Should throw an error when reaction does not exist', async () => {
        const fakeRepo = {
            findById: vi.fn().mockResolvedValue(undefined),
            updateType: vi.fn()
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.updateReactionType(1, 'love')).rejects.toThrow('Field not found');
        expect(fakeRepo.updateType).not.toHaveBeenCalled();
    });

    it('Should throw an error when update failed', async () => {
        const fakeRepo = {
            findById: vi.fn().mockResolvedValue(fakeReactionRows[0]),
            updateType: vi.fn().mockResolvedValue(false)
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.updateReactionType(1, 'love')).rejects.toThrow('Operation failed');
    });

    it('Should return true when type updated', async () => {
        const fakeRepo = {
            findById: vi.fn().mockResolvedValue(fakeReactionRows[0]),
            updateType: vi.fn().mockResolvedValue(true)
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.updateReactionType(1, 'love')).resolves.toBe(true);
        expect(fakeRepo.findById).toHaveBeenCalledWith(1);
        expect(fakeRepo.updateType).toHaveBeenCalledWith(1, 'love');
    });
});

describe('deleteUserReactionInComment', () => {
    it('Should throw an error when user did not react to comment', async () => {
        const fakeRepo = {
            findByAuthorInComment: vi.fn().mockResolvedValue(undefined),
            delete: vi.fn()
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.deleteUserReactionInComment(3, 12)).rejects.toThrow('Field not found');
        expect(fakeRepo.delete).not.toHaveBeenCalled();
    });

    it('Should throw an error when delete failed', async () => {
        const fakeRepo = {
            findByAuthorInComment: vi.fn().mockResolvedValue(fakeReactionRows[0]),
            delete: vi.fn().mockResolvedValue(false)
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.deleteUserReactionInComment(3, 12)).rejects.toThrow('Operation failed');
    });

    it('Should return true when reaction deleted', async () => {
        const fakeRepo = {
            findByAuthorInComment: vi.fn().mockResolvedValue(fakeReactionRows[0]),
            delete: vi.fn().mockResolvedValue(true)
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.deleteUserReactionInComment(3, 12)).resolves.toBe(true);
        expect(fakeRepo.findByAuthorInComment).toHaveBeenCalledWith(3, 12);
        expect(fakeRepo.delete).toHaveBeenCalledWith(3, 12);
    });
});
