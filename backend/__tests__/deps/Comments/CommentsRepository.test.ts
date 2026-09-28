import {describe, expect, it, vi} from "vitest";
import {CommentsRepository} from "../../../dependencies/Comments/CommentsRepository.js";
import type {CommentInsertDTO} from "../../../dependencies/Comments/types.js";

const fakeCommentRows = [
    {id: 1, post_id: 7, user_id: 3, parent_id: null, content: 'First!', created_at: '2026-09-01 10:00'},
    {id: 2, post_id: 7, user_id: 4, parent_id: 1, content: 'Reply', created_at: '2026-09-01 10:05'}
];

describe('findByPost', () => {
    it('Should return comments of post', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([fakeCommentRows])
        };
        const repo = new CommentsRepository(fakePool as any);
        const result = await repo.findByPost(7);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('FROM comments WHERE post_id=:postId'), {postId: 7});
        expect(result).toBe(fakeCommentRows);
    });

    it('Should return null when post has no comments', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new CommentsRepository(fakePool as any);
        await expect(repo.findByPost(7)).resolves.toBeNull();
    });
});

describe('findByUserId', () => {
    it('Should return comments of user in post', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[fakeCommentRows[0]]])
        };
        const repo = new CommentsRepository(fakePool as any);
        const result = await repo.findByUserId(3, 7);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE user_id=:userId AND post_id=:postId'), {userId: 3, postId: 7});
        expect(result).toEqual([fakeCommentRows[0]]);
    });

    it('Should return null when user did not comment post', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new CommentsRepository(fakePool as any);
        await expect(repo.findByUserId(3, 7)).resolves.toBeNull();
    });
});

describe('findById', () => {
    it('Should look for comment together with its child comments', async () => {
        const fakeFoundComment = {postId: 7, id: 1, userId: 3, parentId: null, content: 'First!', comments: []};
        const fakePool = {
            query: vi.fn().mockResolvedValue([[fakeFoundComment]])
        };
        const repo = new CommentsRepository(fakePool as any);
        const result = await repo.findById(3, 1);
        const [query, params] = fakePool.query.mock.calls[0] as [string, Record<string, unknown>];
        expect(query).toContain('WHERE parent_id = :commentId');
        expect(query).toContain('WHERE c.id = :commentId');
        expect(query).toContain('rc.author_id =:userId');
        expect(params).toEqual({userId: 3, commentId: 1});
        expect(result).toBe(fakeFoundComment);
    });

    it('Should return undefined when comment not found', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new CommentsRepository(fakePool as any);
        await expect(repo.findById(3, 1)).resolves.toBeUndefined();
    });
});

describe('findByParentId', () => {
    it('Should return replies to comment', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[fakeCommentRows[1]]])
        };
        const repo = new CommentsRepository(fakePool as any);
        const result = await repo.findByParentId(1);
        expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('FROM comments WHERE parent_id=:parentId'), {parentId: 1});
        expect(result).toEqual([fakeCommentRows[1]]);
    });

    it('Should return null when comment has no replies', async () => {
        const fakePool = {
            query: vi.fn().mockResolvedValue([[]])
        };
        const repo = new CommentsRepository(fakePool as any);
        await expect(repo.findByParentId(1)).resolves.toBeNull();
    });
});

describe('insertDocument', () => {
    it('Should insert only allowed columns', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new CommentsRepository(fakePool as any);
        const result = await repo.insertDocument({
            post_id: 7,
            user_id: 3,
            parent_id: 1,
            content: 'Reply',
            id: 99
        } as any);
        const [query, params] = fakePool.execute.mock.calls[0] as [string, Record<string, unknown>];
        expect(query).toBe('INSERT INTO comments (post_id,user_id,parent_id,content) VALUES(:post_id,:user_id,:parent_id,:content)');
        expect(params).toEqual({post_id: 7, user_id: 3, parent_id: 1, content: 'Reply'});
        expect(result).toBe(true);
    });

    it('Should save missing parent id as null', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new CommentsRepository(fakePool as any);
        const fakeInsertData = {
            post_id: 7,
            user_id: 3,
            parent_id: undefined,
            content: 'First!'
        } as unknown as CommentInsertDTO;
        await repo.insertDocument(fakeInsertData);
        const [, params] = fakePool.execute.mock.calls[0] as [string, Record<string, unknown>];
        expect(params).toEqual({post_id: 7, user_id: 3, parent_id: null, content: 'First!'});
    });

    it('Should return false when nothing was inserted', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 0}])
        };
        const repo = new CommentsRepository(fakePool as any);
        await expect(repo.insertDocument({post_id: 7, user_id: 3, parent_id: null, content: 'First!'})).resolves.toBe(false);
    });
});

describe('updateContent', () => {
    it('Should update content of comment with given id', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new CommentsRepository(fakePool as any);
        const result = await repo.updateContent(1, 'Edited');
        expect(fakePool.execute).toHaveBeenCalledWith(expect.stringContaining('UPDATE comments SET content=:newContent WHERE id=:commentId'), {commentId: 1, newContent: 'Edited'});
        expect(result).toBe(true);
    });

    it('Should return false when nothing was updated', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 0}])
        };
        const repo = new CommentsRepository(fakePool as any);
        await expect(repo.updateContent(1, 'Edited')).resolves.toBe(false);
    });
});

describe('deleteDocument', () => {
    it('Should delete comment with given id', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new CommentsRepository(fakePool as any);
        const result = await repo.deleteDocument(1);
        expect(fakePool.execute).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM comments WHERE id=:commentId'), {commentId: 1});
        expect(result).toBe(true);
    });

    it('Should return false when nothing was deleted', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 0}])
        };
        const repo = new CommentsRepository(fakePool as any);
        await expect(repo.deleteDocument(1)).resolves.toBe(false);
    });
});
