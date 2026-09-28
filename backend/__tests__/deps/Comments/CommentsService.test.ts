import {describe, expect, it, vi} from "vitest";
import {CommentsService} from "../../../dependencies/Comments/CommentsService.js";
import type {CommentInsertDTO} from "../../../dependencies/Comments/types.js";

const fakeCommentRows = [
    {id: 1, post_id: 7, user_id: 3, parent_id: null, content: 'First!', created_at: '2026-09-01 10:00'},
    {id: 2, post_id: 7, user_id: 4, parent_id: 1, content: 'Reply', created_at: '2026-09-01 10:05'}
];

describe('findCommentsByPost', () => {
    it('Should return empty array when post has no comments', async () => {
        const fakeRepo = {
            findByPost: vi.fn().mockResolvedValue(null)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.findCommentsByPost(7)).resolves.toEqual([]);
    });

    it('Should return comments of post', async () => {
        const fakeRepo = {
            findByPost: vi.fn().mockResolvedValue(fakeCommentRows)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.findCommentsByPost(7)).resolves.toBe(fakeCommentRows);
        expect(fakeRepo.findByPost).toHaveBeenCalledWith(7);
    });
});

describe('findUserCommentsByPostId', () => {
    it('Should return empty array when post has no comments', async () => {
        const fakeRepo = {
            findByPost: vi.fn().mockResolvedValue(null)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.findUserCommentsByPostId(7)).resolves.toEqual([]);
    });

    it('Should return comments found for post', async () => {
        const fakeRepo = {
            findByPost: vi.fn().mockResolvedValue(fakeCommentRows)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.findUserCommentsByPostId(7)).resolves.toBe(fakeCommentRows);
        expect(fakeRepo.findByPost).toHaveBeenCalledWith(7);
    });
});

describe('findCommentByCommentId', () => {
    it('Should return null when comment not found', async () => {
        const fakeRepo = {
            findById: vi.fn().mockResolvedValue(undefined)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.findCommentByCommentId(3, 1)).resolves.toBeNull();
    });

    it('Should pass user id and comment id to repository and return comment', async () => {
        const fakeFoundComment = {postId: 7, id: 1, userId: 3, parentId: null, content: 'First!', comments: []};
        const fakeRepo = {
            findById: vi.fn().mockResolvedValue(fakeFoundComment)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.findCommentByCommentId(3, 1)).resolves.toBe(fakeFoundComment);
        expect(fakeRepo.findById).toHaveBeenCalledWith(3, 1);
    });
});

describe('findCommentsByParentId', () => {
    it('Should return empty array when comment has no replies', async () => {
        const fakeRepo = {
            findByParentId: vi.fn().mockResolvedValue(null)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.findCommentsByParentId(1)).resolves.toEqual([]);
    });

    it('Should return replies to comment', async () => {
        const fakeRepo = {
            findByParentId: vi.fn().mockResolvedValue([fakeCommentRows[1]])
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.findCommentsByParentId(1)).resolves.toEqual([fakeCommentRows[1]]);
        expect(fakeRepo.findByParentId).toHaveBeenCalledWith(1);
    });
});

describe('insertComment', () => {
    const fakeInsertData: CommentInsertDTO = {
        post_id: 7,
        user_id: 3,
        parent_id: null,
        content: 'First!'
    };

    it('Should return false when insert failed', async () => {
        const fakeRepo = {
            insertDocument: vi.fn().mockResolvedValue(false)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.insertComment(fakeInsertData)).resolves.toBe(false);
    });

    it('Should pass dto to repository and return true', async () => {
        const fakeRepo = {
            insertDocument: vi.fn().mockResolvedValue(true)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.insertComment(fakeInsertData)).resolves.toBe(true);
        expect(fakeRepo.insertDocument).toHaveBeenCalledWith(fakeInsertData);
    });
});

describe('updateCommentContent', () => {
    it('Should return false when update failed', async () => {
        const fakeRepo = {
            updateContent: vi.fn().mockResolvedValue(false)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.updateCommentContent(1, 'Edited')).resolves.toBe(false);
    });

    it('Should pass comment id and new content to repository', async () => {
        const fakeRepo = {
            updateContent: vi.fn().mockResolvedValue(true)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.updateCommentContent(1, 'Edited')).resolves.toBe(true);
        expect(fakeRepo.updateContent).toHaveBeenCalledWith(1, 'Edited');
    });
});

describe('deleteComment', () => {
    it('Should return false when delete failed', async () => {
        const fakeRepo = {
            deleteDocument: vi.fn().mockResolvedValue(false)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.deleteComment(1)).resolves.toBe(false);
    });

    it('Should pass comment id to repository and return true', async () => {
        const fakeRepo = {
            deleteDocument: vi.fn().mockResolvedValue(true)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.deleteComment(1)).resolves.toBe(true);
        expect(fakeRepo.deleteDocument).toHaveBeenCalledWith(1);
    });
});
