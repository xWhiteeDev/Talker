import {describe, expect, it, vi} from "vitest";
import {PostReactionController} from "../../../dependencies/PostReaction/postReactionController.js";
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

const fakePost = {id: 7, authorId: 5, content: 'Mocked content', visible_for: 'Public'};

describe('createReaction', () => {
    it('Should pass unauthorised error to next when user is not logged in', async () => {
        const fakeReactionService = {
            insertPostReaction: vi.fn()
        };
        const fakePostService = {
            findById: vi.fn()
        };
        const controller = new PostReactionController(fakeReactionService as any, fakePostService as any);
        const http = createHttpMock({currentUser: undefined, body: {data: {postId: 7, type: 'like'}}}) as any;
        const result = await controller.createReaction(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Unauthorised', code: 401}));
        expect(fakePostService.findById).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should pass access denied error to next when user cannot see the post', async () => {
        const fakeReactionService = {
            insertPostReaction: vi.fn()
        };
        const fakePostService = {
            findById: vi.fn().mockResolvedValue(null)
        };
        const controller = new PostReactionController(fakeReactionService as any, fakePostService as any);
        const http = createHttpMock({currentUser: {id: 3}, body: {data: {postId: 7, type: 'like'}}}) as any;
        const result = await controller.createReaction(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Access denied', code: 400}));
        expect(fakeReactionService.insertPostReaction).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should pass error to next when reaction was not saved', async () => {
        const fakeReactionService = {
            insertPostReaction: vi.fn().mockResolvedValue(false)
        };
        const fakePostService = {
            findById: vi.fn().mockResolvedValue(fakePost)
        };
        const controller = new PostReactionController(fakeReactionService as any, fakePostService as any);
        const http = createHttpMock({currentUser: {id: 3}, body: {data: {postId: 7, type: 'like'}}}) as any;
        const result = await controller.createReaction(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Failed to push reaction', code: 400}));
        expect(http.res.status).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should return status 201 when reaction saved', async () => {
        const fakeReactionService = {
            insertPostReaction: vi.fn().mockResolvedValue(true)
        };
        const fakePostService = {
            findById: vi.fn().mockResolvedValue(fakePost)
        };
        const controller = new PostReactionController(fakeReactionService as any, fakePostService as any);
        const http = createHttpMock({currentUser: {id: 3}, body: {data: {postId: 7, type: 'like'}}}) as any;
        const result = await controller.createReaction(http.req, http.res, http.next);
        expect(fakePostService.findById).toHaveBeenCalledWith(3, 7);
        expect(fakeReactionService.insertPostReaction).toHaveBeenCalledWith({authorId: 3, type: 'like', postId: 7});
        expect(http.res.status).toHaveBeenCalledWith(201);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: true});
        expect(result).toBe(true);
    });

    it('Should pass service error to next when post does not exist', async () => {
        const fakeReactionService = {
            insertPostReaction: vi.fn()
        };
        const fakePostService = {
            findById: vi.fn().mockRejectedValue(new ErrorHandler('Post does not exist', 404))
        };
        const controller = new PostReactionController(fakeReactionService as any, fakePostService as any);
        const http = createHttpMock({currentUser: {id: 3}, body: {data: {postId: 7, type: 'like'}}}) as any;
        const result = await controller.createReaction(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Post does not exist', code: 404}));
        expect(fakeReactionService.insertPostReaction).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });
});

describe('deleteReaction', () => {
    it('Should reject with unauthorised error when user is not logged in', async () => {
        const fakeReactionService = {
            deleteUserReactionInPost: vi.fn()
        };
        const controller = new PostReactionController(fakeReactionService as any, {} as any);
        const http = createHttpMock({currentUser: undefined, body: {data: {postId: 7}}}) as any;
        await expect(controller.deleteReaction(http.req, http.res, http.next)).rejects.toThrow('Unauthorised');
        expect(fakeReactionService.deleteUserReactionInPost).not.toHaveBeenCalled();
        expect(http.next).not.toHaveBeenCalled();
    });

    it('Should pass error to next when reaction was not deleted', async () => {
        const fakeReactionService = {
            deleteUserReactionInPost: vi.fn().mockResolvedValue(false)
        };
        const controller = new PostReactionController(fakeReactionService as any, {} as any);
        const http = createHttpMock({currentUser: {id: 3}, body: {data: {postId: 9}}}) as any;
        const result = await controller.deleteReaction(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Failed to delete reaction', code: 400}));
        expect(http.res.status).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should delete reaction of current user in given post', async () => {
        const fakeReactionService = {
            deleteUserReactionInPost: vi.fn().mockResolvedValue(true)
        };
        const controller = new PostReactionController(fakeReactionService as any, {} as any);
        const http = createHttpMock({currentUser: {id: 7}, body: {data: {postId: 7}}}) as any;
        const result = await controller.deleteReaction(http.req, http.res, http.next);
        expect(fakeReactionService.deleteUserReactionInPost).toHaveBeenCalledWith(7, 7);
        expect(http.res.status).toHaveBeenCalledWith(201);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: true});
        expect(result).toBe(true);
    });

    it('Should pass service error to next when reaction does not exist', async () => {
        const fakeReactionService = {
            deleteUserReactionInPost: vi.fn().mockRejectedValue(new ErrorHandler('Field not found', 400))
        };
        const controller = new PostReactionController(fakeReactionService as any, {} as any);
        const http = createHttpMock({currentUser: {id: 3}, body: {data: {postId: 9}}}) as any;
        const result = await controller.deleteReaction(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Field not found', code: 400}));
        expect(result).toBe(false);
    });
});
