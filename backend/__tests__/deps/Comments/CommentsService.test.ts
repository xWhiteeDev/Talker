import {describe, expect, it, vi} from "vitest";
import {CommentsService} from "../../../dependencies/Comments/CommentsService.js";
import type {CommentInsertDTO} from "../../../dependencies/Comments/types.js";

describe('findCommentsByPost', () => {
    it('Should return empty array when comments not found', async () => {
        const fakeRepo = {
            findByPost: vi.fn().mockResolvedValue(null)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.findCommentsByPost(4)).resolves.toEqual([]);
        expect(fakeRepo.findByPost).toHaveBeenCalledWith(4);
    });

    it('Should return comments when found', async () => {
        const rows = [{id: 1}];
        const fakeRepo = {
            findByPost: vi.fn().mockResolvedValue(rows)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.findCommentsByPost(4)).resolves.toBe(rows);
    });
});

describe('findUserCommentsByPostId', () => {
    it('Should return empty array when comments not found', async () => {
        const fakeRepo = {
            findByPost: vi.fn().mockResolvedValue(null)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.findUserCommentsByPostId(4)).resolves.toEqual([]);
        expect(fakeRepo.findByPost).toHaveBeenCalledWith(4);
    });

    it('Should return comments when found', async () => {
        const rows = [{id: 1}];
        const fakeRepo = {
            findByPost: vi.fn().mockResolvedValue(rows)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.findUserCommentsByPostId(4)).resolves.toBe(rows);
    });
});

describe('findCommentByCommentId', () => {
    it('Should return null when comment not found', async () => {
        const fakeRepo = {
            findById: vi.fn().mockResolvedValue(undefined)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.findCommentByCommentId(2, 9)).resolves.toBe(null);
        expect(fakeRepo.findById).toHaveBeenCalledWith(2, 9);
    });

    it('Should return comment when found', async () => {
        const row = {id: 9};
        const fakeRepo = {
            findById: vi.fn().mockResolvedValue(row)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.findCommentByCommentId(2, 9)).resolves.toBe(row);
    });
});

describe('findCommentsByParentId', () => {
    it('Should return empty array when comments not found', async () => {
        const fakeRepo = {
            findByParentId: vi.fn().mockResolvedValue(null)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.findCommentsByParentId(9)).resolves.toEqual([]);
        expect(fakeRepo.findByParentId).toHaveBeenCalledWith(9);
    });

    it('Should return comments when found', async () => {
        const rows = [{id: 10, parent_id: 9}];
        const fakeRepo = {
            findByParentId: vi.fn().mockResolvedValue(rows)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.findCommentsByParentId(9)).resolves.toBe(rows);
    });
});

describe('insertComment', () => {
    const dto: CommentInsertDTO = {post_id: 4, user_id: 2, parent_id: null, content: 'Nice post'};

    it('Should return false when insert failed', async () => {
        const fakeRepo = {
            insertDocument: vi.fn().mockResolvedValue(false)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.insertComment(dto)).resolves.toBe(false);
        expect(fakeRepo.insertDocument).toHaveBeenCalledWith(dto);
    });

    it('Should return true when comment inserted', async () => {
        const fakeRepo = {
            insertDocument: vi.fn().mockResolvedValue(true)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.insertComment(dto)).resolves.toBe(true);
    });
});

describe('updateCommentContent', () => {
    it('Should return false when update failed', async () => {
        const fakeRepo = {
            updateContent: vi.fn().mockResolvedValue(false)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.updateCommentContent(9, 'Edited')).resolves.toBe(false);
        expect(fakeRepo.updateContent).toHaveBeenCalledWith(9, 'Edited');
    });

    it('Should return true when comment updated', async () => {
        const fakeRepo = {
            updateContent: vi.fn().mockResolvedValue(true)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.updateCommentContent(9, 'Edited')).resolves.toBe(true);
    });
});

describe('deleteComment', () => {
    it('Should return false when delete failed', async () => {
        const fakeRepo = {
            deleteDocument: vi.fn().mockResolvedValue(false)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.deleteComment(9)).resolves.toBe(false);
        expect(fakeRepo.deleteDocument).toHaveBeenCalledWith(9);
    });

    it('Should return true when comment deleted', async () => {
        const fakeRepo = {
            deleteDocument: vi.fn().mockResolvedValue(true)
        };
        const service = new CommentsService(fakeRepo as any);
        await expect(service.deleteComment(9)).resolves.toBe(true);
    });
});
