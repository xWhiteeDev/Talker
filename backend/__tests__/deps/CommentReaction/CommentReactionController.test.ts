import {describe, expect, it, vi} from "vitest";
import {CommentReactionController} from "../../../dependencies/CommentReaction/CommentReactionController.js";

function createHttpMock(overrides: {}) {
    return {
        req: {...overrides},
        res: {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        },
        next: vi.fn()
    };
}

describe('createReaction', () => {
    const body = {data: {type: 'like', postId: 4, commentId: 9}};

    it('Should call next with unauthorised when currentUser is missing', async () => {
        const http = createHttpMock({currentUser: undefined, body}) as any;
        const controller = new CommentReactionController({} as any, {} as any, {} as any);
        const result = await controller.createReaction(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Unauthorised'}));
        expect(result).toBe(false);
    });

    it('Should call next with access denied when user cannot see the post', async () => {
        const fakePostService = {
            findById: vi.fn().mockResolvedValue(null)
        };
        const fakeCommentsService = {
            findCommentByCommentId: vi.fn()
        };
        const http = createHttpMock({currentUser: {id: 2}, body}) as any;
        const controller = new CommentReactionController({} as any, fakePostService as any, fakeCommentsService as any);
        await controller.createReaction(http.req, http.res, http.next);
        expect(fakePostService.findById).toHaveBeenCalledWith(2, 4);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Access denied'}));
        expect(fakeCommentsService.findCommentByCommentId).not.toHaveBeenCalled();
    });

    it('Should call next with an error when comment does not exist', async () => {
        const fakePostService = {
            findById: vi.fn().mockResolvedValue({id: 4})
        };
        const fakeCommentsService = {
            findCommentByCommentId: vi.fn().mockResolvedValue(null)
        };
        const http = createHttpMock({currentUser: {id: 2}, body}) as any;
        const controller = new CommentReactionController({} as any, fakePostService as any, fakeCommentsService as any);
        await controller.createReaction(http.req, http.res, http.next);
        expect(fakeCommentsService.findCommentByCommentId).toHaveBeenCalledWith(2, 9);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Comment not exist!'}));
    });

    it('Should call next with an error when comment belongs to another post', async () => {
        const fakeReactionService = {
            insertCommentReaction: vi.fn()
        };
        const fakePostService = {
            findById: vi.fn().mockResolvedValue({id: 4})
        };
        const fakeCommentsService = {
            findCommentByCommentId: vi.fn().mockResolvedValue({id: 9, postId: 5})
        };
        const http = createHttpMock({currentUser: {id: 2}, body}) as any;
        const controller = new CommentReactionController(fakeReactionService as any, fakePostService as any, fakeCommentsService as any);
        await controller.createReaction(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Comment is not part of that post!'}));
        expect(fakeReactionService.insertCommentReaction).not.toHaveBeenCalled();
    });

    it('Should call next with an error when insert failed', async () => {
        const fakeReactionService = {
            insertCommentReaction: vi.fn().mockResolvedValue(false)
        };
        const fakePostService = {
            findById: vi.fn().mockResolvedValue({id: 4})
        };
        const fakeCommentsService = {
            findCommentByCommentId: vi.fn().mockResolvedValue({id: 9, postId: 4})
        };
        const http = createHttpMock({currentUser: {id: 2}, body}) as any;
        const controller = new CommentReactionController(fakeReactionService as any, fakePostService as any, fakeCommentsService as any);
        await controller.createReaction(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Failed to push reaction'}));
    });

    it('Should return status 201 and success true when succeed', async () => {
        const fakeReactionService = {
            insertCommentReaction: vi.fn().mockResolvedValue(true)
        };
        const fakePostService = {
            findById: vi.fn().mockResolvedValue({id: 4})
        };
        const fakeCommentsService = {
            findCommentByCommentId: vi.fn().mockResolvedValue({id: 9, postId: 4})
        };
        const http = createHttpMock({currentUser: {id: 2}, body}) as any;
        const controller = new CommentReactionController(fakeReactionService as any, fakePostService as any, fakeCommentsService as any);
        const result = await controller.createReaction(http.req, http.res, http.next);
        expect(fakeReactionService.insertCommentReaction).toHaveBeenCalledWith({author_id: 2, type: 'like', comment_id: 9});
        expect(http.res.status).toHaveBeenCalledWith(201);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: true});
        expect(result).toBe(true);
    });
});

describe('deleteReaction', () => {
    const body = {data: {commentId: 9}};

    it('Should reject with unauthorised when currentUser is missing', async () => {
        const http = createHttpMock({currentUser: undefined, body}) as any;
        const controller = new CommentReactionController({} as any, {} as any, {} as any);
        await expect(controller.deleteReaction(http.req, http.res, http.next)).rejects.toThrow('Unauthorised');
    });

    it('Should call next with an error when delete failed', async () => {
        const fakeReactionService = {
            deleteUserReactionInComment: vi.fn().mockResolvedValue(false)
        };
        const http = createHttpMock({currentUser: {id: 2}, body}) as any;
        const controller = new CommentReactionController(fakeReactionService as any, {} as any, {} as any);
        await controller.deleteReaction(http.req, http.res, http.next);
        expect(fakeReactionService.deleteUserReactionInComment).toHaveBeenCalledWith(2, 9);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Failed to delete reaction'}));
    });

    it('Should pass service error to next', async () => {
        const fakeReactionService = {
            deleteUserReactionInComment: vi.fn().mockRejectedValue(new Error('Field not found'))
        };
        const http = createHttpMock({currentUser: {id: 2}, body}) as any;
        const controller = new CommentReactionController(fakeReactionService as any, {} as any, {} as any);
        const result = await controller.deleteReaction(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Field not found'}));
        expect(result).toBe(false);
    });

    it('Should return status 201 and success true when succeed', async () => {
        const fakeReactionService = {
            deleteUserReactionInComment: vi.fn().mockResolvedValue(true)
        };
        const http = createHttpMock({currentUser: {id: 2}, body}) as any;
        const controller = new CommentReactionController(fakeReactionService as any, {} as any, {} as any);
        const result = await controller.deleteReaction(http.req, http.res, http.next);
        expect(http.res.status).toHaveBeenCalledWith(201);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: true});
        expect(result).toBe(true);
    });
});
