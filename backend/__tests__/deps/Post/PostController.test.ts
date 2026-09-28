import {describe, expect, it, vi} from "vitest";
import {PostController} from "../../../dependencies/Post/postController.js";
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

describe('fetchLatestPosts', () => {
    it('Should pass error to next when user does not have identifier', async () => {
        const fakePostService = {
            findLatestPosts: vi.fn()
        };
        const controller = new PostController(fakePostService as any);
        const http = createHttpMock({currentUser: undefined}) as any;
        const result = await controller.fetchLatestPosts(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'User does not have their identifier', code: 400}));
        expect(fakePostService.findLatestPosts).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should pass 404 error to next when posts were not found', async () => {
        const fakePostService = {
            findLatestPosts: vi.fn().mockResolvedValue(null)
        };
        const controller = new PostController(fakePostService as any);
        const http = createHttpMock({currentUser: {id: 2}}) as any;
        const result = await controller.fetchLatestPosts(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(new ErrorHandler('Failed to fetch posts', 404));
        expect(http.res.status).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should return status 200 with posts when found', async () => {
        const fakePosts = [
            {id: 1, authorId: 2, content: 'First post'},
            {id: 2, authorId: 5, content: 'Second post'}
        ];
        const fakePostService = {
            findLatestPosts: vi.fn().mockResolvedValue(fakePosts)
        };
        const controller = new PostController(fakePostService as any);
        const http = createHttpMock({currentUser: {id: 2}}) as any;
        const result = await controller.fetchLatestPosts(http.req, http.res, http.next);
        expect(fakePostService.findLatestPosts).toHaveBeenCalledWith(2);
        expect(http.res.status).toHaveBeenCalledWith(200);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: fakePosts});
        expect(http.next).not.toHaveBeenCalled();
        expect(result).toBe(fakePosts);
    });

    it('Should pass service error to next', async () => {
        const serviceError = new Error('Database is down');
        const fakePostService = {
            findLatestPosts: vi.fn().mockRejectedValue(serviceError)
        };
        const controller = new PostController(fakePostService as any);
        const http = createHttpMock({currentUser: {id: 2}}) as any;
        const result = await controller.fetchLatestPosts(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(serviceError);
        expect(http.res.status).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });
});

describe('getSpecifiedPost', () => {
    it('Should pass error to next when user does not have identifier', async () => {
        const fakePostService = {
            findById: vi.fn()
        };
        const controller = new PostController(fakePostService as any);
        const http = createHttpMock({currentUser: undefined, params: {id: '7'}}) as any;
        const result = await controller.getSpecifiedPost(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'User does not have their identifier', code: 400}));
        expect(fakePostService.findById).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should pass error to next when id param is missing', async () => {
        const fakePostService = {
            findById: vi.fn()
        };
        const controller = new PostController(fakePostService as any);
        const http = createHttpMock({currentUser: {id: 2}, params: {}}) as any;
        const result = await controller.getSpecifiedPost(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'ID param not provided', code: 400}));
        expect(fakePostService.findById).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should pass error to next when id param is an array', async () => {
        const fakePostService = {
            findById: vi.fn()
        };
        const controller = new PostController(fakePostService as any);
        const http = createHttpMock({currentUser: {id: 2}, params: {id: ['7', '8']}}) as any;
        await controller.getSpecifiedPost(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'ID param not provided', code: 400}));
        expect(fakePostService.findById).not.toHaveBeenCalled();
    });

    it('Should pass 404 error to next when post is not visible for user', async () => {
        const fakePostService = {
            findById: vi.fn().mockResolvedValue(null)
        };
        const controller = new PostController(fakePostService as any);
        const http = createHttpMock({currentUser: {id: 2}, params: {id: '7'}}) as any;
        const result = await controller.getSpecifiedPost(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Failed to fetch posts', code: 404}));
        expect(http.res.status).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should ask service for post with details and return it', async () => {
        const fakePost = {id: 7, authorId: 3, content: 'Hello', comments: []};
        const fakePostService = {
            findById: vi.fn().mockResolvedValue(fakePost)
        };
        const controller = new PostController(fakePostService as any);
        const http = createHttpMock({currentUser: {id: 2}, params: {id: '7'}}) as any;
        const result = await controller.getSpecifiedPost(http.req, http.res, http.next);
        expect(fakePostService.findById).toHaveBeenCalledWith(2, 7, true);
        expect(http.res.status).toHaveBeenCalledWith(200);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: fakePost});
        expect(result).toBe(fakePost);
    });

    it('Should pass service error to next when post does not exist', async () => {
        const fakePostService = {
            findById: vi.fn().mockRejectedValue(new ErrorHandler('Post does not exist', 404))
        };
        const controller = new PostController(fakePostService as any);
        const http = createHttpMock({currentUser: {id: 2}, params: {id: '7'}}) as any;
        const result = await controller.getSpecifiedPost(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Post does not exist', code: 404}));
        expect(result).toBe(false);
    });
});

describe('insertNewPost', () => {
    it('Should pass error to next when user does not have identifier', async () => {
        const fakePostService = {
            insertPost: vi.fn()
        };
        const controller = new PostController(fakePostService as any);
        const http = createHttpMock({
            currentUser: undefined,
            body: {data: {content: 'Hello world', visible_for: 'Public'}}
        }) as any;
        const result = await controller.insertNewPost(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'User does not have their identifier', code: 400}));
        expect(fakePostService.insertPost).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should take author id from current user instead of request body', async () => {
        const fakePostService = {
            insertPost: vi.fn().mockResolvedValue(true)
        };
        const controller = new PostController(fakePostService as any);
        const http = createHttpMock({
            currentUser: {id: 4},
            body: {data: {content: 'Hello world', visible_for: 'Friends', authorId: 999}}
        }) as any;
        await controller.insertNewPost(http.req, http.res, http.next);
        expect(fakePostService.insertPost).toHaveBeenCalledWith({
            authorId: 4,
            content: 'Hello world',
            visible_for: 'Friends'
        });
    });

    it('Should return status 200 and success true when post inserted', async () => {
        const fakePostService = {
            insertPost: vi.fn().mockResolvedValue(true)
        };
        const controller = new PostController(fakePostService as any);
        const http = createHttpMock({
            currentUser: {id: 4},
            body: {data: {content: 'Hello world', visible_for: 'Public'}}
        }) as any;
        const result = await controller.insertNewPost(http.req, http.res, http.next);
        expect(http.res.status).toHaveBeenCalledWith(200);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: true});
        expect(http.next).not.toHaveBeenCalled();
        expect(result).toBe(true);
    });

    it('Should pass 500 error to next when insert failed', async () => {
        const fakePostService = {
            insertPost: vi.fn().mockResolvedValue(false)
        };
        const controller = new PostController(fakePostService as any);
        const http = createHttpMock({
            currentUser: {id: 4},
            body: {data: {content: 'Hello world', visible_for: 'Public'}}
        }) as any;
        const result = await controller.insertNewPost(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Insert action goes wrong', code: 500}));
        expect(http.res.status).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('Should pass service error to next when author does not exist', async () => {
        const fakePostService = {
            insertPost: vi.fn().mockRejectedValue(new ErrorHandler('User not exist', 400))
        };
        const controller = new PostController(fakePostService as any);
        const http = createHttpMock({
            currentUser: {id: 4},
            body: {data: {content: 'Hello world', visible_for: 'Public'}}
        }) as any;
        await controller.insertNewPost(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'User not exist', code: 400}));
    });
});
