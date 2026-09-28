import {describe, expect, it, vi} from "vitest";
import {CommentsRepository} from "../../../dependencies/Comments/CommentsRepository.js";
import type {CommentInsertDTO} from "../../../dependencies/Comments/types.js";

describe('findByPost', () => {
    it('Should pass postId to WHERE clause', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new CommentsRepository(fakePool as any);
        await repo.findByPost(4);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE post_id=:postId'), {postId: 4});
    });

    it('Should return null when comments not found', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new CommentsRepository(fakePool as any);
        await expect(repo.findByPost(4)).resolves.toBe(null);
    });

    it('Should return comments when found', async () => {
        const rows = [{id: 1, post_id: 4}];
        const fakePool = {
            query: vi.fn().mockResolvedValue([rows])
        };
        const repo = new CommentsRepository(fakePool as any);
        await expect(repo.findByPost(4)).resolves.toBe(rows);
    });
});

describe('findByUserId', () => {
    it('Should pass userId and postId to WHERE clause', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new CommentsRepository(fakePool as any);
        await repo.findByUserId(2, 4);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE user_id=:userId AND post_id=:postId'), {userId: 2, postId: 4});
    });

    it('Should return null when comments not found', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new CommentsRepository(fakePool as any);
        await expect(repo.findByUserId(2, 4)).resolves.toBe(null);
    });

    it('Should return comments when found', async () => {
        const rows = [{id: 1, user_id: 2, post_id: 4}];
        const fakePool = {
            query: vi.fn().mockResolvedValue([rows])
        };
        const repo = new CommentsRepository(fakePool as any);
        await expect(repo.findByUserId(2, 4)).resolves.toBe(rows);
    });
});

describe('findById', () => {
    it('Should pass userId and commentId to query', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new CommentsRepository(fakePool as any);
        await repo.findById(2, 9);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE c.id = :commentId'), {userId: 2, commentId: 9});
    });

    it('Should return undefined when comment not found', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new CommentsRepository(fakePool as any);
        await expect(repo.findById(2, 9)).resolves.toBeUndefined();
    });

    it('Should return comment when found', async () => {
        const row = {id: 9, postId: 4, comments: []};
        const fakePool = {
            query: vi.fn().mockResolvedValue([[row]])
        };
        const repo = new CommentsRepository(fakePool as any);
        await expect(repo.findById(2, 9)).resolves.toBe(row);
    });
});

describe('findByParentId', () => {
    it('Should pass parentId to WHERE clause', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new CommentsRepository(fakePool as any);
        await repo.findByParentId(9);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE parent_id=:parentId'), {parentId: 9});
    });

    it('Should return null when comments not found', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new CommentsRepository(fakePool as any);
        await expect(repo.findByParentId(9)).resolves.toBe(null);
    });

    it('Should return comments when found', async () => {
        const rows = [{id: 10, parent_id: 9}];
        const fakePool = {
            query: vi.fn().mockResolvedValue([rows])
        };
        const repo = new CommentsRepository(fakePool as any);
        await expect(repo.findByParentId(9)).resolves.toBe(rows);
    });
});

describe('insertDocument', () => {
    const dto: CommentInsertDTO = {
        post_id: 4,
        user_id: 2,
        parent_id: 9,
        content: 'Nice post'
    };

    it('Should build query from allowed keys', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new CommentsRepository(fakePool as any);
        await repo.insertDocument(dto);
        expect(fakePool.execute).toHaveBeenCalledWith(
            'INSERT INTO comments (post_id,user_id,parent_id,content) VALUES(:post_id,:user_id,:parent_id,:content)',
            dto
        );
    });

    it('Should skip keys which are not allowed', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new CommentsRepository(fakePool as any);
        await repo.insertDocument({...dto, id: 100} as any);
        const [query, params] = fakePool.execute.mock.calls[0]!;
        expect(query).toBe('INSERT INTO comments (post_id,user_id,parent_id,content) VALUES(:post_id,:user_id,:parent_id,:content)');
        expect(params).not.toHaveProperty('id');
    });

    it('Should replace empty parent_id with null', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new CommentsRepository(fakePool as any);
        await repo.insertDocument({...dto, parent_id: undefined} as any);
        expect(fakePool.execute).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({parent_id: null}));
    });

    it('Should return true when comment inserted', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new CommentsRepository(fakePool as any);
        await expect(repo.insertDocument(dto)).resolves.toBe(true);
    });

    it('Should return false when comment not inserted', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 0}])
        };
        const repo = new CommentsRepository(fakePool as any);
        await expect(repo.insertDocument(dto)).resolves.toBe(false);
    });
});

describe('updateContent', () => {
    it('Should pass commentId and new content to query', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new CommentsRepository(fakePool as any);
        await repo.updateContent(9, 'Edited');
        expect(fakePool.execute).toHaveBeenCalledWith(expect.stringContaining('SET content=:newContent WHERE id=:commentId'), {commentId: 9, newContent: 'Edited'});
    });

    it('Should return true when comment updated', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new CommentsRepository(fakePool as any);
        await expect(repo.updateContent(9, 'Edited')).resolves.toBe(true);
    });

    it('Should return false when comment not updated', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 0}])
        };
        const repo = new CommentsRepository(fakePool as any);
        await expect(repo.updateContent(9, 'Edited')).resolves.toBe(false);
    });
});

describe('deleteDocument', () => {
    it('Should pass commentId to WHERE clause', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new CommentsRepository(fakePool as any);
        await repo.deleteDocument(9);
        expect(fakePool.execute).toHaveBeenCalledWith(expect.stringContaining('WHERE id=:commentId'), {commentId: 9});
    });

    it('Should return true when comment deleted', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new CommentsRepository(fakePool as any);
        await expect(repo.deleteDocument(9)).resolves.toBe(true);
    });

    it('Should return false when comment not deleted', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 0}])
        };
        const repo = new CommentsRepository(fakePool as any);
        await expect(repo.deleteDocument(9)).resolves.toBe(false);
    });
});
