import {describe, expect, it, vi} from "vitest";
import {PostReactionRepository} from "../../../dependencies/PostReaction/postReactionRepository.js";
import type {PostReactionInsertDTO} from "../../../dependencies/PostReaction/types.js";

describe('findById', () => {
    it('Should pass id to WHERE clause', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new PostReactionRepository(fakePool as any);
        await repo.findById(7);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE id=:id'), {id: 7});
    });

    it('Should return undefined when reaction not found', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new PostReactionRepository(fakePool as any);
        await expect(repo.findById(7)).resolves.toBeUndefined();
    });

    it('Should return reaction when found', async () => {
        const row = {id: 7, type: 'like'};
        const fakePool = {
            query: vi.fn().mockResolvedValue([[row]])
        };
        const repo = new PostReactionRepository(fakePool as any);
        await expect(repo.findById(7)).resolves.toBe(row);
    });
});

describe('findByAuthor', () => {
    it('Should pass authorId to WHERE clause and return rows', async () => {
        const rows = [{id: 7}];
        const fakePool = {
            query: vi.fn().mockResolvedValue([rows])
        };
        const repo = new PostReactionRepository(fakePool as any);
        const result = await repo.findByAuthor(2);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE author_id=:authorId'), {authorId: 2});
        expect(result).toBe(rows);
    });
});

describe('findByPostId', () => {
    it('Should pass postId to WHERE clause and return rows', async () => {
        const rows = [{id: 7}];
        const fakePool = {
            query: vi.fn().mockResolvedValue([rows])
        };
        const repo = new PostReactionRepository(fakePool as any);
        const result = await repo.findByPostId(4);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE post_id=:postId'), {postId: 4});
        expect(result).toBe(rows);
    });
});

describe('findByType', () => {
    it('Should pass type and postId to WHERE clause and return rows', async () => {
        const rows = [{id: 7, type: 'love'}];
        const fakePool = {
            query: vi.fn().mockResolvedValue([rows])
        };
        const repo = new PostReactionRepository(fakePool as any);
        const result = await repo.findByType('love', 4);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE type=:type AND post_id=:postId'), {type: 'love', postId: 4});
        expect(result).toBe(rows);
    });
});

describe('findByAuthorInPost', () => {
    it('Should pass authorId and postId to WHERE clause', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new PostReactionRepository(fakePool as any);
        await repo.findByAuthorInPost(2, 4);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE author_id=:authorId AND post_id=:postId'), {authorId: 2, postId: 4});
    });

    it('Should return undefined when reaction not found', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new PostReactionRepository(fakePool as any);
        await expect(repo.findByAuthorInPost(2, 4)).resolves.toBeUndefined();
    });

    it('Should return reaction when found', async () => {
        const row = {id: 7, author_id: 2, post_id: 4};
        const fakePool = {
            query: vi.fn().mockResolvedValue([[row]])
        };
        const repo = new PostReactionRepository(fakePool as any);
        await expect(repo.findByAuthorInPost(2, 4)).resolves.toBe(row);
    });
});

describe('insert', () => {
    const dto: PostReactionInsertDTO = {authorId: 2, type: 'like', postId: 4};

    it('Should pass dto values to query', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new PostReactionRepository(fakePool as any);
        await repo.insert(dto);
        expect(fakePool.execute).toHaveBeenCalledWith(expect.stringContaining('VALUES(:authorId,:type,:postId)'), dto);
    });

    it('Should return true when reaction inserted', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new PostReactionRepository(fakePool as any);
        await expect(repo.insert(dto)).resolves.toBe(true);
    });

    it('Should return false when reaction not inserted', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 0}])
        };
        const repo = new PostReactionRepository(fakePool as any);
        await expect(repo.insert(dto)).resolves.toBe(false);
    });
});

describe('updateType', () => {
    it('Should pass reaction id and new type to query', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new PostReactionRepository(fakePool as any);
        await repo.updateType(7, 'wow');
        expect(fakePool.execute).toHaveBeenCalledWith(expect.stringContaining('SET type=:newType WHERE id=:id'), {id: 7, newType: 'wow'});
    });

    it('Should return true when reaction updated', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new PostReactionRepository(fakePool as any);
        await expect(repo.updateType(7, 'wow')).resolves.toBe(true);
    });

    it('Should return false when reaction not updated', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 0}])
        };
        const repo = new PostReactionRepository(fakePool as any);
        await expect(repo.updateType(7, 'wow')).resolves.toBe(false);
    });
});

describe('delete', () => {
    it('Should pass authorId and postId to WHERE clause', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new PostReactionRepository(fakePool as any);
        await repo.delete(2, 4);
        expect(fakePool.execute).toHaveBeenCalledWith(expect.stringContaining('WHERE author_id=:authorId AND post_id=:postId'), {authorId: 2, postId: 4});
    });

    it('Should return true when reaction deleted', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new PostReactionRepository(fakePool as any);
        await expect(repo.delete(2, 4)).resolves.toBe(true);
    });

    it('Should return false when reaction not deleted', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 0}])
        };
        const repo = new PostReactionRepository(fakePool as any);
        await expect(repo.delete(2, 4)).resolves.toBe(false);
    });
});
