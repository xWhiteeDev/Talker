import {describe, expect, it, vi} from "vitest";
import {CommentsController} from "../../../dependencies/Comments/CommentsController.js";

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

describe('insertComment', () => {
    const body = {data: {postId: 4, parentId: null, content: 'Nice post'}};

    it('Should call next with an error when currentUser is missing', async () => {
        const http = createHttpMock({currentUser: undefined, body}) as any;
        const controller = new CommentsController({} as any, {} as any);
        const result = await controller.insertComment(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Invalid data'}));
        expect(result).toBe(false);
    });

    it('Should call next with an error when body data is missing', async () => {
        const http = createHttpMock({currentUser: {id: 2}, body: {}}) as any;
        const controller = new CommentsController({} as any, {} as any);
        await controller.insertComment(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Invalid data'}));
    });

    it('Should call next with access denied when user cannot see the post', async () => {
        const fakeCommentsService = {
            insertComment: vi.fn()
        };
        const fakePostService = {
            findById: vi.fn().mockResolvedValue(null)
        };
        const http = createHttpMock({currentUser: {id: 2}, body}) as any;
        const controller = new CommentsController(fakeCommentsService as any, fakePostService as any);
        await controller.insertComment(http.req, http.res, http.next);
        expect(fakePostService.findById).toHaveBeenCalledWith(2, 4);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Access denied'}));
        expect(fakeCommentsService.insertComment).not.toHaveBeenCalled();
    });

    it('Should call next with an error when insert failed', async () => {
        const fakeCommentsService = {
            insertComment: vi.fn().mockResolvedValue(false)
        };
        const fakePostService = {
            findById: vi.fn().mockResolvedValue({id: 4})
        };
        const http = createHttpMock({currentUser: {id: 2}, body}) as any;
        const controller = new CommentsController(fakeCommentsService as any, fakePostService as any);
        await controller.insertComment(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Failed to insert comment'}));
    });

    it('Should map body data to insert payload', async () => {
        const fakeCommentsService = {
            insertComment: vi.fn().mockResolvedValue(true)
        };
        const fakePostService = {
            findById: vi.fn().mockResolvedValue({id: 4})
        };
        const http = createHttpMock({currentUser: {id: 2}, body}) as any;
        const controller = new CommentsController(fakeCommentsService as any, fakePostService as any);
        await controller.insertComment(http.req, http.res, http.next);
        expect(fakeCommentsService.insertComment).toHaveBeenCalledWith({
            post_id: 4,
            user_id: 2,
            parent_id: null,
            content: 'Nice post'
        });
    });

    it('Should return status 201 and success true when succeed', async () => {
        const fakeCommentsService = {
            insertComment: vi.fn().mockResolvedValue(true)
        };
        const fakePostService = {
            findById: vi.fn().mockResolvedValue({id: 4})
        };
        const http = createHttpMock({currentUser: {id: 2}, body}) as any;
        const controller = new CommentsController(fakeCommentsService as any, fakePostService as any);
        const result = await controller.insertComment(http.req, http.res, http.next);
        expect(http.res.status).toHaveBeenCalledWith(201);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: true});
        expect(result).toBe(true);
    });
});

describe('findByPostId', () => {
    it('Should call next with an error when currentUser is missing', async () => {
        const http = createHttpMock({currentUser: undefined, params: {id: '9'}}) as any;
        const controller = new CommentsController({} as any, {} as any);
        const result = await controller.findByPostId(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'User not assigned'}));
        expect(result).toBe(false);
    });

    it('Should call next with an error when id param is missing', async () => {
        const http = createHttpMock({currentUser: {id: 2}, params: {}}) as any;
        const controller = new CommentsController({} as any, {} as any);
        await controller.findByPostId(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Comment id missing'}));
    });

    it('Should call next with an error when comment not found', async () => {
        const fakeCommentsService = {
            findCommentByCommentId: vi.fn().mockResolvedValue(null)
        };
        const http = createHttpMock({currentUser: {id: 2}, params: {id: '9'}}) as any;
        const controller = new CommentsController(fakeCommentsService as any, {} as any);
        await controller.findByPostId(http.req, http.res, http.next);
        expect(fakeCommentsService.findCommentByCommentId).toHaveBeenCalledWith(2, 9);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Failed to find comment'}));
    });

    it('Should return comment when succeed', async () => {
        const comment = {id: 9, postId: 4};
        const fakeCommentsService = {
            findCommentByCommentId: vi.fn().mockResolvedValue(comment)
        };
        const http = createHttpMock({currentUser: {id: 2}, params: {id: '9'}}) as any;
        const controller = new CommentsController(fakeCommentsService as any, {} as any);
        const result = await controller.findByPostId(http.req, http.res, http.next);
        expect(http.res.status).toHaveBeenCalledWith(201);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: comment});
        expect(result).toBe(true);
    });
});
