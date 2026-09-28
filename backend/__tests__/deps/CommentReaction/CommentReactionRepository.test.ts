import {describe, expect, it, vi} from "vitest";
import {CommentReactionRepository} from "../../../dependencies/CommentReaction/CommentReactionRepository.js";
import type {CommentReactionInsertDTO} from "../../../dependencies/CommentReaction/types.js";

describe('findById', () => {
    it('Should pass id to WHERE clause', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        await repo.findById(7);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE id=:id'), {id: 7});
    });

    it('Should return undefined when reaction not found', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        await expect(repo.findById(7)).resolves.toBeUndefined();
    });

    it('Should return reaction when found', async () => {
        const row = {id: 7, type: 'like'};
        const fakePool = {
            query: vi.fn().mockResolvedValue([[row]])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        await expect(repo.findById(7)).resolves.toBe(row);
    });
});

describe('findByAuthor', () => {
    it('Should pass authorId to WHERE clause and return rows', async () => {
        const rows = [{id: 7}];
        const fakePool = {
            query: vi.fn().mockResolvedValue([rows])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        const result = await repo.findByAuthor(2);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE author_id=:authorId'), {authorId: 2});
        expect(result).toBe(rows);
    });
});

describe('findByCommentId', () => {
    it('Should pass commentId to WHERE clause and return rows', async () => {
        const rows = [{id: 7}];
        const fakePool = {
            query: vi.fn().mockResolvedValue([rows])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        const result = await repo.findByCommentId(9);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE comment_id=:commentId'), {commentId: 9});
        expect(result).toBe(rows);
    });
});

describe('findByType', () => {
    it('Should pass type and commentId to WHERE clause and return rows', async () => {
        const rows = [{id: 7, type: 'love'}];
        const fakePool = {
            query: vi.fn().mockResolvedValue([rows])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        const result = await repo.findByType('love', 9);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE type=:type AND comment_id=:commentId'), {type: 'love', commentId: 9});
        expect(result).toBe(rows);
    });
});

describe('findByAuthorInComment', () => {
    it('Should pass authorId and commentId to WHERE clause', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        await repo.findByAuthorInComment(2, 9);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE author_id=:authorId AND comment_id=:commentId'), {authorId: 2, commentId: 9});
    });

    it('Should return undefined when reaction not found', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        await expect(repo.findByAuthorInComment(2, 9)).resolves.toBeUndefined();
    });

    it('Should return reaction when found', async () => {
        const row = {id: 7, author_id: 2, comment_id: 9};
        const fakePool = {
            query: vi.fn().mockResolvedValue([[row]])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        await expect(repo.findByAuthorInComment(2, 9)).resolves.toBe(row);
    });
});

describe('insert', () => {
    const dto: CommentReactionInsertDTO = {author_id: 2, type: 'like', comment_id: 9};

    it('Should pass dto values to query', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        await repo.insert(dto);
        expect(fakePool.execute).toHaveBeenCalledWith(expect.stringContaining('VALUES(:author_id,:type,:comment_id)'), dto);
    });

    it('Should return true when reaction inserted', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        await expect(repo.insert(dto)).resolves.toBe(true);
    });

    it('Should return false when reaction not inserted', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 0}])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        await expect(repo.insert(dto)).resolves.toBe(false);
    });
});

describe('updateType', () => {
    it('Should pass reaction id and new type to query', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        await repo.updateType(7, 'wow');
        expect(fakePool.execute).toHaveBeenCalledWith(expect.stringContaining('SET type=:newType WHERE id=:id'), {id: 7, newType: 'wow'});
    });

    it('Should return true when reaction updated', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        await expect(repo.updateType(7, 'wow')).resolves.toBe(true);
    });

    it('Should return false when reaction not updated', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 0}])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        await expect(repo.updateType(7, 'wow')).resolves.toBe(false);
    });
});

describe('delete', () => {
    it('Should pass authorId and commentId to WHERE clause', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        await repo.delete(2, 9);
        expect(fakePool.execute).toHaveBeenCalledWith(expect.stringContaining('WHERE author_id=:authorId AND comment_id=:commentId'), {authorId: 2, commentId: 9});
    });

    it('Should return true when reaction deleted', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        await expect(repo.delete(2, 9)).resolves.toBe(true);
    });

    it('Should return false when reaction not deleted', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 0}])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        await expect(repo.delete(2, 9)).resolves.toBe(false);
    });
});
