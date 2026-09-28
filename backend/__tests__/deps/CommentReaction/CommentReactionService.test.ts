import {describe, expect, it, vi} from "vitest";
import {CommentReactionService} from "../../../dependencies/CommentReaction/CommentReactionService.js";
import type {CommentReactionInsertDTO} from "../../../dependencies/CommentReaction/types.js";

describe('findCommentReactions', () => {
    it('Should throw an error when reactions not found', async () => {
        const fakeRepo = {
            findByCommentId: vi.fn().mockResolvedValue([])
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.findCommentReactions(9)).rejects.toThrow('Field not found');
    });

    it('Should return reactions when found', async () => {
        const rows = [{id: 7}];
        const fakeRepo = {
            findByCommentId: vi.fn().mockResolvedValue(rows)
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.findCommentReactions(9)).resolves.toBe(rows);
        expect(fakeRepo.findByCommentId).toHaveBeenCalledWith(9);
    });
});

describe('findCommentReactionsByType', () => {
    it('Should throw an error when reactions not found', async () => {
        const fakeRepo = {
            findByType: vi.fn().mockResolvedValue([])
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.findCommentReactionsByType(9, 'like')).rejects.toThrow('Field not found');
    });

    it('Should pass arguments in repository order and return reactions', async () => {
        const rows = [{id: 7, type: 'like'}];
        const fakeRepo = {
            findByType: vi.fn().mockResolvedValue(rows)
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.findCommentReactionsByType(9, 'like')).resolves.toBe(rows);
        expect(fakeRepo.findByType).toHaveBeenCalledWith('like', 9);
    });
});

describe('findAllUserReactions', () => {
    it('Should throw an error when reactions not found', async () => {
        const fakeRepo = {
            findByAuthor: vi.fn().mockResolvedValue([])
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.findAllUserReactions(2)).rejects.toThrow('Field not found');
    });

    it('Should return reactions when found', async () => {
        const rows = [{id: 7}];
        const fakeRepo = {
            findByAuthor: vi.fn().mockResolvedValue(rows)
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.findAllUserReactions(2)).resolves.toBe(rows);
        expect(fakeRepo.findByAuthor).toHaveBeenCalledWith(2);
    });
});

describe('findUserReactionInComment', () => {
    it('Should throw an error when reaction not found', async () => {
        const fakeRepo = {
            findByAuthorInComment: vi.fn().mockResolvedValue(undefined)
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.findUserReactionInComment(2, 9)).rejects.toThrow('Field not found');
    });

    it('Should return reaction when found', async () => {
        const row = {id: 7};
        const fakeRepo = {
            findByAuthorInComment: vi.fn().mockResolvedValue(row)
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.findUserReactionInComment(2, 9)).resolves.toBe(row);
        expect(fakeRepo.findByAuthorInComment).toHaveBeenCalledWith(2, 9);
    });
});

describe('insertCommentReaction', () => {
    const dto: CommentReactionInsertDTO = {author_id: 2, type: 'like', comment_id: 9};

    it('Should insert reaction when user has not reacted yet', async () => {
        const fakeRepo = {
            findByAuthorInComment: vi.fn().mockResolvedValue(undefined),
            delete: vi.fn(),
            insert: vi.fn().mockResolvedValue(true)
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.insertCommentReaction(dto)).resolves.toBe(true);
        expect(fakeRepo.delete).not.toHaveBeenCalled();
        expect(fakeRepo.insert).toHaveBeenCalledWith(dto);
    });

    it('Should remove reaction without inserting when the same type is sent again', async () => {
        const fakeRepo = {
            findByAuthorInComment: vi.fn().mockResolvedValue({id: 7, type: 'like'}),
            delete: vi.fn().mockResolvedValue(true),
            insert: vi.fn()
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.insertCommentReaction(dto)).resolves.toBe(true);
        expect(fakeRepo.delete).toHaveBeenCalledWith(2, 9);
        expect(fakeRepo.insert).not.toHaveBeenCalled();
    });

    it('Should replace reaction when a different type is sent', async () => {
        const fakeRepo = {
            findByAuthorInComment: vi.fn().mockResolvedValue({id: 7, type: 'wow'}),
            delete: vi.fn().mockResolvedValue(true),
            insert: vi.fn().mockResolvedValue(true)
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.insertCommentReaction(dto)).resolves.toBe(true);
        expect(fakeRepo.delete).toHaveBeenCalledWith(2, 9);
        expect(fakeRepo.insert).toHaveBeenCalledWith(dto);
    });

    it('Should throw an error when insert failed', async () => {
        const fakeRepo = {
            findByAuthorInComment: vi.fn().mockResolvedValue(undefined),
            insert: vi.fn().mockResolvedValue(false)
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.insertCommentReaction(dto)).rejects.toThrow('Operation failed');
    });
});

describe('updateReactionType', () => {
    it('Should throw an error when reaction not found', async () => {
        const fakeRepo = {
            findById: vi.fn().mockResolvedValue(undefined),
            updateType: vi.fn()
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.updateReactionType(7, 'wow')).rejects.toThrow('Field not found');
        expect(fakeRepo.updateType).not.toHaveBeenCalled();
    });

    it('Should throw an error when update failed', async () => {
        const fakeRepo = {
            findById: vi.fn().mockResolvedValue({id: 7}),
            updateType: vi.fn().mockResolvedValue(false)
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.updateReactionType(7, 'wow')).rejects.toThrow('Operation failed');
    });

    it('Should return true when reaction updated', async () => {
        const fakeRepo = {
            findById: vi.fn().mockResolvedValue({id: 7}),
            updateType: vi.fn().mockResolvedValue(true)
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.updateReactionType(7, 'wow')).resolves.toBe(true);
        expect(fakeRepo.updateType).toHaveBeenCalledWith(7, 'wow');
    });
});

describe('deleteUserReactionInComment', () => {
    it('Should throw an error when reaction not found', async () => {
        const fakeRepo = {
            findByAuthorInComment: vi.fn().mockResolvedValue(undefined),
            delete: vi.fn()
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.deleteUserReactionInComment(2, 9)).rejects.toThrow('Field not found');
        expect(fakeRepo.delete).not.toHaveBeenCalled();
    });

    it('Should throw an error when delete failed', async () => {
        const fakeRepo = {
            findByAuthorInComment: vi.fn().mockResolvedValue({id: 7}),
            delete: vi.fn().mockResolvedValue(false)
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.deleteUserReactionInComment(2, 9)).rejects.toThrow('Operation failed');
    });

    it('Should return true when reaction deleted', async () => {
        const fakeRepo = {
            findByAuthorInComment: vi.fn().mockResolvedValue({id: 7}),
            delete: vi.fn().mockResolvedValue(true)
        };
        const service = new CommentReactionService(fakeRepo as any);
        await expect(service.deleteUserReactionInComment(2, 9)).resolves.toBe(true);
        expect(fakeRepo.delete).toHaveBeenCalledWith(2, 9);
    });
});
