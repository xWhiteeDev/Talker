import {describe, expect, it, vi} from "vitest";
import {PostController} from "../../../dependencies/Post/postController.js";

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
    it('Should call next with an error when currentUser is missing', async () => {
        const http = createHttpMock({currentUser: undefined}) as any;
        const controller = new PostController({} as any);
        const result = await controller.fetchLatestPosts(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'User does not have their identifier'}));
        expect(result).toBe(false);
    });

    it('Should call next with an error when posts not found', async () => {
        const fakeService = {
            findLatestPosts: vi.fn().mockResolvedValue(null)
        };
        const http = createHttpMock({currentUser: {id: 3}}) as any;
        const controller = new PostController(fakeService as any);
        await controller.fetchLatestPosts(http.req, http.res, http.next);
        expect(fakeService.findLatestPosts).toHaveBeenCalledWith(3);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Failed to fetch posts'}));
        expect(http.res.status).not.toHaveBeenCalled();
    });

    it('Should return status 200 with posts when succeed', async () => {
        const posts = [{id: 1}, {id: 2}];
        const fakeService = {
            findLatestPosts: vi.fn().mockResolvedValue(posts)
        };
        const http = createHttpMock({currentUser: {id: 3}}) as any;
        const controller = new PostController(fakeService as any);
        const result = await controller.fetchLatestPosts(http.req, http.res, http.next);
        expect(http.res.status).toHaveBeenCalledWith(200);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: posts});
        expect(result).toBe(posts);
    });

    it('Should pass service error to next', async () => {
        const error = new Error('Database down');
        const fakeService = {
            findLatestPosts: vi.fn().mockRejectedValue(error)
        };
        const http = createHttpMock({currentUser: {id: 3}}) as any;
        const controller = new PostController(fakeService as any);
        const result = await controller.fetchLatestPosts(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(error);
        expect(result).toBe(false);
    });
});

describe('getSpecifiedPost', () => {
    it('Should call next with an error when currentUser is missing', async () => {
        const http = createHttpMock({currentUser: undefined, params: {id: '1'}}) as any;
        const controller = new PostController({} as any);
        await controller.getSpecifiedPost(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'User does not have their identifier'}));
    });

    it('Should call next with an error when id param is missing', async () => {
        const fakeService = {
            findById: vi.fn()
        };
        const http = createHttpMock({currentUser: {id: 3}, params: {}}) as any;
        const controller = new PostController(fakeService as any);
        await controller.getSpecifiedPost(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'ID param not provided'}));
        expect(fakeService.findById).not.toHaveBeenCalled();
    });

    it('Should call next with an error when id param is an array', async () => {
        const fakeService = {
            findById: vi.fn()
        };
        const http = createHttpMock({currentUser: {id: 3}, params: {id: ['1', '2']}}) as any;
        const controller = new PostController(fakeService as any);
        await controller.getSpecifiedPost(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'ID param not provided'}));
        expect(fakeService.findById).not.toHaveBeenCalled();
    });

    it('Should call next with an error when post is not visible', async () => {
        const fakeService = {
            findById: vi.fn().mockResolvedValue(null)
        };
        const http = createHttpMock({currentUser: {id: 3}, params: {id: '10'}}) as any;
        const controller = new PostController(fakeService as any);
        await controller.getSpecifiedPost(http.req, http.res, http.next);
        expect(fakeService.findById).toHaveBeenCalledWith(3, 10, true);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Failed to fetch posts'}));
    });

    it('Should return status 200 with post when succeed', async () => {
        const post = {id: 10, authorId: 3};
        const fakeService = {
            findById: vi.fn().mockResolvedValue(post)
        };
        const http = createHttpMock({currentUser: {id: 3}, params: {id: '10'}}) as any;
        const controller = new PostController(fakeService as any);
        const result = await controller.getSpecifiedPost(http.req, http.res, http.next);
        expect(http.res.status).toHaveBeenCalledWith(200);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: post});
        expect(result).toBe(post);
    });

    it('Should pass service error to next', async () => {
        const fakeService = {
            findById: vi.fn().mockRejectedValue(new Error('Post does not exist'))
        };
        const http = createHttpMock({currentUser: {id: 3}, params: {id: '10'}}) as any;
        const controller = new PostController(fakeService as any);
        await controller.getSpecifiedPost(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Post does not exist'}));
    });
});

describe('insertNewPost', () => {
    const body = {data: {content: 'Hello', visible_for: 'Public'}};

    it('Should call next with an error when currentUser is missing', async () => {
        const http = createHttpMock({currentUser: undefined, body}) as any;
        const controller = new PostController({} as any);
        const result = await controller.insertNewPost(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'User does not have their identifier'}));
        expect(result).toBe(false);
    });

    it('Should build payload from currentUser and body data', async () => {
        const fakeService = {
            insertPost: vi.fn().mockResolvedValue(true)
        };
        const http = createHttpMock({currentUser: {id: 3}, body}) as any;
        const controller = new PostController(fakeService as any);
        await controller.insertNewPost(http.req, http.res, http.next);
        expect(fakeService.insertPost).toHaveBeenCalledWith({authorId: 3, content: 'Hello', visible_for: 'Public'});
    });

    it('Should call next with an error when insert failed', async () => {
        const fakeService = {
            insertPost: vi.fn().mockResolvedValue(false)
        };
        const http = createHttpMock({currentUser: {id: 3}, body}) as any;
        const controller = new PostController(fakeService as any);
        await controller.insertNewPost(http.req, http.res, http.next);
        expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Insert action goes wrong'}));
        expect(http.res.status).not.toHaveBeenCalled();
    });

    it('Should return status 200 and success true when succeed', async () => {
        const fakeService = {
            insertPost: vi.fn().mockResolvedValue(true)
        };
        const http = createHttpMock({currentUser: {id: 3}, body}) as any;
        const controller = new PostController(fakeService as any);
        const result = await controller.insertNewPost(http.req, http.res, http.next);
        expect(http.res.status).toHaveBeenCalledWith(200);
        expect(http.res.json).toHaveBeenCalledWith({success: true, data: true});
        expect(result).toBe(true);
    });
});
