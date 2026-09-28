import {describe, expect, it, vi} from "vitest";
import {CommentsController} from "../../../dependencies/Comments/CommentsController.js";
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

describe('insertComment', () => {
    it('Should pass error to next when body data is missing', async () => {
        const fakeCommentsService = {
            insertComment: vi.fn()
        };
        const fakePostService = {
            findById: vi.fn()
        };
        const controller = new CommentsController(fakeCommentsService as any, fakePostService as any);
        const http = createHttpMock({currentUser: {id: 3}, body: {}}) as any;
        const result = await controller.insertComment(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Invalid data', code: 400}));
        expect(fakePostService.findById).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should pass error to next when user is not logged in', async () => {
        const fakeCommentsService = {
            insertComment: vi.fn()
        };
        const fakePostService = {
            findById: vi.fn()
        };
        const controller = new CommentsController(fakeCommentsService as any, fakePostService as any);
        const http = createHttpMock({
            currentUser: undefined,
            body: {data: {postId: 10, parentId: null, content: 'Nice post!'}}
        }) as any;
        const result = await controller.insertComment(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Invalid data', code: 400}));
        expect(fakePostService.findById).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should pass access denied error to next when user cannot see the post', async () => {
        const fakeCommentsService = {
            insertComment: vi.fn()
        };
        const fakePostService = {
            findById: vi.fn().mockResolvedValue(null)
        };
        const controller = new CommentsController(fakeCommentsService as any, fakePostService as any);
        const http = createHttpMock({
            currentUser: {id: 3},
            body: {data: {postId: 10, parentId: null, content: 'Nice post!'}}
        }) as any;
        const result = await controller.insertComment(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Access denied', code: 400}));
        expect(fakeCommentsService.insertComment).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should pass error to next when comment was not inserted', async () => {
        const fakeCommentsService = {
            insertComment: vi.fn().mockResolvedValue(false)
        };
        const fakePostService = {
            findById: vi.fn().mockResolvedValue(fakePost)
        };
        const controller = new CommentsController(fakeCommentsService as any, fakePostService as any);
        const http = createHttpMock({
            currentUser: {id: 3},
            body: {data: {postId: 10, parentId: null, content: 'Nice post!'}}
        }) as any;
        const result = await controller.insertComment(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Failed to insert comment', code: 400}));
        expect(http.res.status).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should insert comment and return true', async () => {
        const fakeCommentsService = {
            insertComment: vi.fn().mockResolvedValue(true)
        };
        const fakePostService = {
            findById: vi.fn()
        };
        const controller = new CommentsController(fakeCommentsService as any, fakePostService as any);
        const http = createHttpMock({
            currentUser: {id: 3},
            body: {data: {postId: 10, parentId: null, content: 'Nice post!'}}
        }) as any;
        const result = await controller.insertComment(http.req, http.res, http.next);
        expect(fakePostService.findById).toHaveBeenCalledWith(3, 10);
        expect(result).toBeDefined();
    });

    it('Should pass service error to next when post does not exist', async () => {
        const fakeCommentsService = {
            insertComment: vi.fn()
        };
        const fakePostService = {
            findById: vi.fn().mockRejectedValue(new ErrorHandler('Post does not exist', 404))
        };
        const controller = new CommentsController(fakeCommentsService as any, fakePostService as any);
        const http = createHttpMock({
            currentUser: {id: 3},
            body: {data: {postId: 10, parentId: null, content: 'Nice post!'}}
        }) as any;
        const result = await controller.insertComment(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Post does not exist', code: 404}));
        expect(fakeCommentsService.insertComment).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });
});

describe('findByPostId', () => {
    it('Should pass error to next when user is not assigned', async () => {
        const fakeCommentsService = {
            findCommentByCommentId: vi.fn()
        };
        const controller = new CommentsController(fakeCommentsService as any, {} as any);
        const http = createHttpMock({currentUser: undefined, params: {id: '12'}}) as any;
        const result = await controller.findByPostId(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'User not assigned', code: 403}));
        expect(fakeCommentsService.findCommentByCommentId).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should pass error to next when comment id is missing', async () => {
        const fakeCommentsService = {
            findCommentByCommentId: vi.fn()
        };
        const controller = new CommentsController(fakeCommentsService as any, {} as any);
        const http = createHttpMock({currentUser: {id: 3}, params: {}}) as any;
        const result = await controller.findByPostId(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Comment id missing', code: 400}));
        expect(fakeCommentsService.findCommentByCommentId).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should pass error to next when comment not found', async () => {
        const fakeCommentsService = {
            findCommentByCommentId: vi.fn().mockResolvedValue(null)
        };
        const controller = new CommentsController(fakeCommentsService as any, {} as any);
        const http = createHttpMock({currentUser: {id: 3}, params: {id: '12'}}) as any;
        const result = await controller.findByPostId(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Failed to find comment', code: 400}));
        expect(http.res.status).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should return found comment', async () => {
        const fakeFoundComment = {postId: 10, id: 12, userId: 5, parentId: null, content: 'First!', comments: []};
        const fakeCommentsService = {
            findCommentByCommentId: vi.fn().mockResolvedValue(fakeFoundComment)
        };
        const controller = new CommentsController(fakeCommentsService as any, {} as any);
        const http = createHttpMock({currentUser: {id: 3}, params: {id: '12'}}) as any;
        const result = await controller.findByPostId(http.req, http.res, http.next);
        expect(fakeCommentsService.findCommentByCommentId).toHaveBeenCalledWith(3, 12);
        expect(http.res.status).toHaveBeenCalledWith(201);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: fakeFoundComment});
        expect(result).toBe(true);
    });

    it('Should pass service error to next', async () => {
        const serviceError = new Error('Database is down');
        const fakeCommentsService = {
            findCommentByCommentId: vi.fn().mockRejectedValue(serviceError)
        };
        const controller = new CommentsController(fakeCommentsService as any, {} as any);
        const http = createHttpMock({currentUser: {id: 3}, params: {id: '12'}}) as any;
        const result = await controller.findByPostId(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(serviceError);
        expect(result).toBe(false);
    });
});
