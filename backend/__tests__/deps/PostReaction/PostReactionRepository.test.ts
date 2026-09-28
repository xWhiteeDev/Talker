import {describe, expect, it, vi} from "vitest";
import {PostReactionRepository} from "../../../dependencies/PostReaction/postReactionRepository.js";

const fakeReactionRow = {id: 1, author_id: 3, type: 'like', post_id: 7};

describe('findById', () => {
    it('Should return reaction when found', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[fakeReactionRow]])
        };
        const repo = new PostReactionRepository(fakePool as any);
        const result = await repo.findById(1);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('FROM reactions_post WHERE id=:id LIMIT 1'), {id: 1});
        expect(result).toBe(fakeReactionRow);
    });

    it('Should return undefined when reaction not found', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new PostReactionRepository(fakePool as any);
        await expect(repo.findById(1)).resolves.toBeUndefined();
    });
});

describe('findByAuthor', () => {
    it('Should return all reactions of author', async () => {
        const fakeRows = [fakeReactionRow, {...fakeReactionRow, id: 2, post_id: 8}];
        const fakePool = {
            query: vi.fn().mockResolvedValue([fakeRows])
        };
        const repo = new PostReactionRepository(fakePool as any);
        const result = await repo.findByAuthor(3);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('FROM reactions_post WHERE author_id=:authorId'), {authorId: 3});
        expect(result).toBe(fakeRows);
    });
});

describe('findByPostId', () => {
    it('Should return all reactions of post', async () => {
        const fakeRows = [fakeReactionRow, {...fakeReactionRow, id: 2, author_id: 4}];
        const fakePool = {
            query: vi.fn().mockResolvedValue([fakeRows])
        };
        const repo = new PostReactionRepository(fakePool as any);
        const result = await repo.findByPostId(7);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('FROM reactions_post WHERE post_id=:postId'), {postId: 7});
        expect(result).toBe(fakeRows);
    });

    it('Should return empty array when post has no reactions', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new PostReactionRepository(fakePool as any);
        await expect(repo.findByPostId(7)).resolves.toEqual([]);
    });
});

describe('findByType', () => {
    it('Should filter reactions by type and post', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[fakeReactionRow]])
        };
        const repo = new PostReactionRepository(fakePool as any);
        const result = await repo.findByType('like', 7);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE type=:type AND post_id=:postId'), {type: 'like', postId: 7});
        expect(result).toEqual([fakeReactionRow]);
    });
});

describe('findByAuthorInPost', () => {
    it('Should return reaction of author in post', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[fakeReactionRow]])
        };
        const repo = new PostReactionRepository(fakePool as any);
        const result = await repo.findByAuthorInPost(3, 7);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE author_id=:authorId AND post_id=:postId'), {authorId: 3, postId: 7});
        expect(result).toBe(fakeReactionRow);
    });

    it('Should return undefined when author did not react to post', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new PostReactionRepository(fakePool as any);
        await expect(repo.findByAuthorInPost(3, 7)).resolves.toBeUndefined();
    });
});

describe('insert', () => {
    it('Should insert reaction and return true when row was affected', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new PostReactionRepository(fakePool as any);
        const result = await repo.insert({authorId: 3, type: 'like', postId: 7});
        expect(fakePool.execute).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO reactions_post (author_id,type,post_id) VALUES(:authorId,:type,:postId)'),
            {authorId: 3, type: 'like', postId: 7}
        );
        expect(result).toBe(true);
    });

    it('Should return false when nothing was inserted', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 0}])
        };
        const repo = new PostReactionRepository(fakePool as any);
        await expect(repo.insert({authorId: 3, type: 'like', postId: 7})).resolves.toBe(false);
    });
});

describe('updateType', () => {
    it('Should update type of reaction with given id', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new PostReactionRepository(fakePool as any);
        const result = await repo.updateType(1, 'love');
        expect(fakePool.execute).toHaveBeenCalledWith(expect.stringContaining('UPDATE reactions_post SET type=:newType WHERE id=:id'), {id: 1, newType: 'love'});
        expect(result).toBe(true);
    });

    it('Should return false when nothing was updated', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 0}])
        };
        const repo = new PostReactionRepository(fakePool as any);
        await expect(repo.updateType(1, 'love')).resolves.toBe(false);
    });
});

describe('delete', () => {
    it('Should delete reaction of author in post', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new PostReactionRepository(fakePool as any);
        const result = await repo.delete(3, 7);
        expect(fakePool.execute).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM reactions_post WHERE author_id=:authorId AND post_id=:postId'), {authorId: 3, postId: 7});
        expect(result).toBe(true);
    });

    it('Should return false when nothing was deleted', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 0}])
        };
        const repo = new PostReactionRepository(fakePool as any);
        await expect(repo.delete(3, 7)).resolves.toBe(false);
    });
});
