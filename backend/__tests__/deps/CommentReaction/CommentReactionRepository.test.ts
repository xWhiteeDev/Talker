import {describe, expect, it, vi} from "vitest";
import {CommentReactionRepository} from "../../../dependencies/CommentReaction/CommentReactionRepository.js";

const fakeReactionRow = {id: 1, author_id: 3, type: 'like', comment_id: 12, created_at: '2026-09-01 10:00'};

describe('findById', () => {
    it('Should return reaction when found', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[fakeReactionRow]])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        const result = await repo.findById(1);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('FROM reactions_comment WHERE id=:id LIMIT 1'), {id: 1});
        expect(result).toBe(fakeReactionRow);
    });

    it('Should return undefined when reaction not found', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        await expect(repo.findById(1)).resolves.toBeUndefined();
    });
});

describe('findByAuthor', () => {
    it('Should return all reactions of author', async () => {
        const fakeRows = [fakeReactionRow, {...fakeReactionRow, id: 2, comment_id: 13}];
        const fakePool = {
            query: vi.fn().mockResolvedValue([fakeRows])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        const result = await repo.findByAuthor(3);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('FROM reactions_comment WHERE author_id=:authorId'), {authorId: 3});
        expect(result).toBe(fakeRows);
    });
});

describe('findByCommentId', () => {
    it('Should return all reactions of comment', async () => {
        const fakeRows = [fakeReactionRow, {...fakeReactionRow, id: 2, author_id: 4}];
        const fakePool = {
            query: vi.fn().mockResolvedValue([fakeRows])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        const result = await repo.findByCommentId(12);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('FROM reactions_comment WHERE comment_id=:commentId'), {commentId: 12});
        expect(result).toBe(fakeRows);
    });

    it('Should return empty array when comment has no reactions', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        await expect(repo.findByCommentId(12)).resolves.toEqual([]);
    });
});

describe('findByType', () => {
    it('Should filter reactions by type and comment', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[fakeReactionRow]])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        const result = await repo.findByType('like', 12);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE type=:type AND comment_id=:commentId'), {type: 'like', commentId: 12});
        expect(result).toEqual([fakeReactionRow]);
    });
});

describe('findByAuthorInComment', () => {
    it('Should return reaction of author in comment', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[fakeReactionRow]])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        const result = await repo.findByAuthorInComment(3, 12);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE author_id=:authorId AND comment_id=:commentId'), {authorId: 3, commentId: 12});
        expect(result).toBe(fakeReactionRow);
    });

    it('Should return undefined when author did not react to comment', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        await expect(repo.findByAuthorInComment(3, 12)).resolves.toBeUndefined();
    });
});

describe('insert', () => {
    it('Should insert reaction and return true when row was affected', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        const result = await repo.insert({author_id: 3, type: 'like', comment_id: 12});
        expect(fakePool.execute).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO reactions_comment (author_id,type,comment_Id) VALUES(:author_id,:type,:comment_id)'),
            {author_id: 3, type: 'like', comment_id: 12}
        );
        expect(result).toBe(true);
    });

    it('Should return false when nothing was inserted', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 0}])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        await expect(repo.insert({author_id: 3, type: 'like', comment_id: 12})).resolves.toBe(false);
    });
});

describe('updateType', () => {
    it('Should update type of reaction with given id', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        const result = await repo.updateType(1, 'love');
        expect(fakePool.execute).toHaveBeenCalledWith(expect.stringContaining('UPDATE reactions_comment SET type=:newType WHERE id=:id'), {id: 1, newType: 'love'});
        expect(result).toBe(true);
    });

    it('Should return false when nothing was updated', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 0}])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        await expect(repo.updateType(1, 'love')).resolves.toBe(false);
    });
});

describe('delete', () => {
    it('Should delete reaction of author in comment', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        const result = await repo.delete(3, 12);
        expect(fakePool.execute).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM reactions_comment WHERE author_id=:authorId AND comment_id=:commentId'), {authorId: 3, commentId: 12});
        expect(result).toBe(true);
    });

    it('Should return false when nothing was deleted', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 0}])
        };
        const repo = new CommentReactionRepository(fakePool as any);
        await expect(repo.delete(3, 12)).resolves.toBe(false);
    });
});
