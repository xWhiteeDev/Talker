import {describe, expect, it, vi} from "vitest";
import {PostReactionController} from "../../../dependencies/PostReaction/postReactionController.js";

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
    const body = {data: {type: 'like', postId: 4}};

    it('Should call next with unauthorised when currentUser is missing', async () => {
        const http = createHttpMock({currentUser: undefined, body}) as any;
        const controller = new PostReactionController({} as any, {} as any);
        const result = await controller.createReaction(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Unauthorised'}));
        expect(result).toBe(false);
    });

    it('Should call next with access denied when user cannot see the post', async () => {
        const fakeReactionService = {
            insertPostReaction: vi.fn()
        };
        const fakePostService = {
            findById: vi.fn().mockResolvedValue(null)
        };
        const http = createHttpMock({currentUser: {id: 2}, body}) as any;
        const controller = new PostReactionController(fakeReactionService as any, fakePostService as any);
        await controller.createReaction(http.req, http.res, http.next);
        expect(fakePostService.findById).toHaveBeenCalledWith(2, 4);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Access denied'}));
        expect(fakeReactionService.insertPostReaction).not.toHaveBeenCalled();
    });

    it('Should call next with an error when insert failed', async () => {
        const fakeReactionService = {
            insertPostReaction: vi.fn().mockResolvedValue(false)
        };
        const fakePostService = {
            findById: vi.fn().mockResolvedValue({id: 4})
        };
        const http = createHttpMock({currentUser: {id: 2}, body}) as any;
        const controller = new PostReactionController(fakeReactionService as any, fakePostService as any);
        await controller.createReaction(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Failed to push reaction'}));
    });

    it('Should return status 201 and success true when succeed', async () => {
        const fakeReactionService = {
            insertPostReaction: vi.fn().mockResolvedValue(true)
        };
        const fakePostService = {
            findById: vi.fn().mockResolvedValue({id: 4})
        };
        const http = createHttpMock({currentUser: {id: 2}, body}) as any;
        const controller = new PostReactionController(fakeReactionService as any, fakePostService as any);
        const result = await controller.createReaction(http.req, http.res, http.next);
        expect(fakeReactionService.insertPostReaction).toHaveBeenCalledWith({authorId: 2, type: 'like', postId: 4});
        expect(http.res.status).toHaveBeenCalledWith(201);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: true});
        expect(result).toBe(true);
    });

    it('Should pass service error to next', async () => {
        const fakePostService = {
            findById: vi.fn().mockRejectedValue(new Error('Post does not exist'))
        };
        const http = createHttpMock({currentUser: {id: 2}, body}) as any;
        const controller = new PostReactionController({} as any, fakePostService as any);
        await controller.createReaction(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Post does not exist'}));
    });
});

describe('deleteReaction', () => {
    const body = {data: {postId: 4}};

    it('Should reject with unauthorised when currentUser is missing', async () => {
        const http = createHttpMock({currentUser: undefined, body}) as any;
        const controller = new PostReactionController({} as any, {} as any);
        await expect(controller.deleteReaction(http.req, http.res, http.next)).rejects.toThrow('Unauthorised');
    });

    it('Should call next with an error when delete failed', async () => {
        const fakeReactionService = {
            deleteUserReactionInPost: vi.fn().mockResolvedValue(false)
        };
        const http = createHttpMock({currentUser: {id: 2}, body}) as any;
        const controller = new PostReactionController(fakeReactionService as any, {} as any);
        await controller.deleteReaction(http.req, http.res, http.next);
        expect(fakeReactionService.deleteUserReactionInPost).toHaveBeenCalledWith(2, 4);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Failed to delete reaction'}));
    });

    it('Should pass service error to next', async () => {
        const fakeReactionService = {
            deleteUserReactionInPost: vi.fn().mockRejectedValue(new Error('Field not found'))
        };
        const http = createHttpMock({currentUser: {id: 2}, body}) as any;
        const controller = new PostReactionController(fakeReactionService as any, {} as any);
        const result = await controller.deleteReaction(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Field not found'}));
        expect(result).toBe(false);
    });

    it('Should return status 201 and success true when succeed', async () => {
        const fakeReactionService = {
            deleteUserReactionInPost: vi.fn().mockResolvedValue(true)
        };
        const http = createHttpMock({currentUser: {id: 2}, body}) as any;
        const controller = new PostReactionController(fakeReactionService as any, {} as any);
        const result = await controller.deleteReaction(http.req, http.res, http.next);
        expect(http.res.status).toHaveBeenCalledWith(201);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: true});
        expect(result).toBe(true);
    });
});
