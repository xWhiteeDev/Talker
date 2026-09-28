import {describe, expect, it, vi} from "vitest";
import {CommentReactionController} from "../../../dependencies/CommentReaction/CommentReactionController.js";
import {ErrorHandler} from "../../../handlers/errorHandler.js";

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

const fakePost = {id: 10, authorId: 5, content: 'Mocked content', visible_for: 'Public'};
const fakeComment = {postId: 10, id: 12, userId: 5, parentId: null, content: 'First!', comments: []};
const fakeReactionBody = {postId: 10, commentId: 12, type: 'like'};

describe('createReaction', () => {
    it('Should pass unauthorised error to next when user is not logged in', async () => {
        const fakePostService = {
            findById: vi.fn()
        };
        const controller = new CommentReactionController({} as any, fakePostService as any, {} as any);
        const http = createHttpMock({currentUser: undefined, body: {data: fakeReactionBody}}) as any;
        const result = await controller.createReaction(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Unauthorised', code: 401}));
        expect(fakePostService.findById).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should pass access denied error to next when user cannot see the post', async () => {
        const fakePostService = {
            findById: vi.fn().mockResolvedValue(null)
        };
        const fakeCommentsService = {
            findCommentByCommentId: vi.fn()
        };
        const controller = new CommentReactionController({} as any, fakePostService as any, fakeCommentsService as any);
        const http = createHttpMock({currentUser: {id: 3}, body: {data: fakeReactionBody}}) as any;
        const result = await controller.createReaction(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Access denied', code: 400}));
        expect(fakeCommentsService.findCommentByCommentId).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should pass error to next when comment does not exist', async () => {
        const fakeReactionService = {
            insertCommentReaction: vi.fn()
        };
        const fakePostService = {
            findById: vi.fn().mockResolvedValue(fakePost)
        };
        const fakeCommentsService = {
            findCommentByCommentId: vi.fn().mockResolvedValue(null)
        };
        const controller = new CommentReactionController(fakeReactionService as any, fakePostService as any, fakeCommentsService as any);
        const http = createHttpMock({currentUser: {id: 3}, body: {data: fakeReactionBody}}) as any;
        const result = await controller.createReaction(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Comment not exist!', code: 400}));
        expect(fakeReactionService.insertCommentReaction).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should pass error to next when comment belongs to another post', async () => {
        const fakeReactionService = {
            insertCommentReaction: vi.fn()
        };
        const fakePostService = {
            findById: vi.fn().mockResolvedValue(fakePost)
        };
        const fakeCommentsService = {
            findCommentByCommentId: vi.fn().mockResolvedValue({...fakeComment, postId: 99})
        };
        const controller = new CommentReactionController(fakeReactionService as any, fakePostService as any, fakeCommentsService as any);
        const http = createHttpMock({currentUser: {id: 3}, body: {data: fakeReactionBody}}) as any;
        const result = await controller.createReaction(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Comment is not part of that post!', code: 400}));
        expect(fakeReactionService.insertCommentReaction).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should pass error to next when reaction was not saved', async () => {
        const fakeReactionService = {
            insertCommentReaction: vi.fn().mockResolvedValue(false)
        };
        const fakePostService = {
            findById: vi.fn().mockResolvedValue(fakePost)
        };
        const fakeCommentsService = {
            findCommentByCommentId: vi.fn().mockResolvedValue(fakeComment)
        };
        const controller = new CommentReactionController(fakeReactionService as any, fakePostService as any, fakeCommentsService as any);
        const http = createHttpMock({currentUser: {id: 3}, body: {data: fakeReactionBody}}) as any;
        const result = await controller.createReaction(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Failed to push reaction', code: 400}));
        expect(http.res.status).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should return status 201 when reaction saved', async () => {
        const fakeReactionService = {
            insertCommentReaction: vi.fn().mockResolvedValue(true)
        };
        const fakePostService = {
            findById: vi.fn().mockResolvedValue(fakePost)
        };
        const fakeCommentsService = {
            findCommentByCommentId: vi.fn().mockResolvedValue(fakeComment)
        };
        const controller = new CommentReactionController(fakeReactionService as any, fakePostService as any, fakeCommentsService as any);
        const http = createHttpMock({currentUser: {id: 3}, body: {data: fakeReactionBody}}) as any;
        const result = await controller.createReaction(http.req, http.res, http.next);
        expect(fakePostService.findById).toHaveBeenCalledWith(3, 10);
        expect(fakeCommentsService.findCommentByCommentId).toHaveBeenCalledWith(3, 12);
        expect(fakeReactionService.insertCommentReaction).toHaveBeenCalledWith({author_id: 3, type: 'like', comment_id: 12});
        expect(http.res.status).toHaveBeenCalledWith(201);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: true});
        expect(result).toBe(true);
    });

    it('Should pass service error to next when post does not exist', async () => {
        const fakePostService = {
            findById: vi.fn().mockRejectedValue(new ErrorHandler('Post does not exist', 404))
        };
        const controller = new CommentReactionController({} as any, fakePostService as any, {} as any);
        const http = createHttpMock({currentUser: {id: 3}, body: {data: fakeReactionBody}}) as any;
        const result = await controller.createReaction(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Post does not exist', code: 404}));
        expect(result).toBe(false);
    });
});

describe('deleteReaction', () => {
    it('Should reject with unauthorised error when user is not logged in', async () => {
        const fakeReactionService = {
            deleteUserReactionInComment: vi.fn()
        };
        const controller = new CommentReactionController(fakeReactionService as any, {} as any, {} as any);
        const http = createHttpMock({currentUser: undefined, body: {data: {commentId: 12}}}) as any;
        await expect(controller.deleteReaction(http.req, http.res, http.next)).rejects.toThrow('Unauthorised');
        expect(fakeReactionService.deleteUserReactionInComment).not.toHaveBeenCalled();
        expect(http.next).not.toHaveBeenCalled();
    });

    it('Should pass error to next when reaction was not deleted', async () => {
        const fakeReactionService = {
            deleteUserReactionInComment: vi.fn().mockResolvedValue(false)
        };
        const controller = new CommentReactionController(fakeReactionService as any, {} as any, {} as any);
        const http = createHttpMock({currentUser: {id: 3}, body: {data: {commentId: 12}}}) as any;
        const result = await controller.deleteReaction(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Failed to delete reaction', code: 400}));
        expect(http.res.status).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should delete reaction of current user in given comment', async () => {
        const fakeReactionService = {
            deleteUserReactionInComment: vi.fn().mockResolvedValue(true)
        };
        const controller = new CommentReactionController(fakeReactionService as any, {} as any, {} as any);
        const http = createHttpMock({currentUser: {id: 3}, body: {data: {commentId: 12}}}) as any;
        const result = await controller.deleteReaction(http.req, http.res, http.next);
        expect(fakeReactionService.deleteUserReactionInComment).toHaveBeenCalledWith(3, 12);
        expect(http.res.status).toHaveBeenCalledWith(201);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: true});
        expect(result).toBe(true);
    });

    it('Should pass service error to next when reaction does not exist', async () => {
        const fakeReactionService = {
            deleteUserReactionInComment: vi.fn().mockRejectedValue(new ErrorHandler('Field not found', 400))
        };
        const controller = new CommentReactionController(fakeReactionService as any, {} as any, {} as any);
        const http = createHttpMock({currentUser: {id: 3}, body: {data: {commentId: 12}}}) as any;
        const result = await controller.deleteReaction(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Field not found', code: 400}));
        expect(result).toBe(false);
    });
});
