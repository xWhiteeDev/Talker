import {afterAll, beforeAll, describe, expect, it, vi} from "vitest";
import {PostRepository} from "../../../dependencies/Post/postRepository.js";


type TPostVisibility = 'Public' | 'Friends' | 'Private';
interface IMockedPostRowProps {
    id: number;
    authorId: number;
    visible_for?: TPostVisibility;
}

interface IMockedPostRow extends IMockedPostRowProps {
    createdAt: string,
    content: string,
    fullName: string,
    reactions: Record<string, number>,
    myReaction: string,
    commentsCount: number,
    photo: string | null,
    video: string | null,
    file: string | null,
    gif: string | null,
    taggedUsers: string | null,
    pinnedPlace: string | null;
}
/**
 * Function mocks an post row objects
 * @param propsToMock 
 * @returns Mocked post row
 */
function mockPostRow(propsToMock: IMockedPostRowProps): IMockedPostRow {
    return {
        id: propsToMock.id,
        createdAt: "01/01/1970",
        authorId: propsToMock.authorId,
        content: "Mocked content",
        visible_for: propsToMock.visible_for ?? 'Public',
        fullName: "JSON Mock",
        reactions: {'like': 20, 'love': 10, 'wow': 30},
        myReaction: "like",
        commentsCount: 0,
        photo: null,
        video: null,
        file: null,
        gif: null,
        taggedUsers: null,
        pinnedPlace: null
    };
}


describe('findById', () => {
    it('Should return post row', async () => {
        const fakePostRow = mockPostRow({id: 6, authorId: 5});
        const fakePool = {
            query: vi.fn().mockResolvedValue([[fakePostRow]])
        };

        const repo = new PostRepository(fakePool as any);
        const result = await repo.findById(6, 4);
        const [query, params] = fakePool.query.mock.calls[0] as [string, Record<string, unknown>];
        expect(query).toContain('posts.id = :id');
        expect(query).toContain("posts.visible_for = 'Friends'");
        expect(query).toContain("posts.visible_for = 'Private'");
        expect(params).toEqual({id: 6, currentUserId: 4});
        expect(result).toMatchObject({id: 6, authorId: 5});
    });
    it('Should passed when query args are the same as provided in function', async () => {
        const fakePostRow = mockPostRow({id: 6, authorId: 5});
        const fakePool = {
            query: vi.fn().mockResolvedValue([[fakePostRow]])
        };
        const repo = new PostRepository(fakePool as any);
        const result = await repo.findById(6, 1, true);
        const [query, params] = fakePool.query.mock.calls[0] as [string, Record<string, unknown>];
        expect(query).toContain('WHERE p.id = :id');
        expect(params).toEqual({id: 6, currentUserId: 1});
        expect(result).toMatchObject({id: 6, authorId: 5});
    });
});

describe('findByAuthor', () => {
    it('Should return post row when author found and query args are the same as function input arguments', async () => {
        const fakePostRow = mockPostRow({id: 2, authorId: 6});
        const fakePool = {
            query: vi.fn().mockResolvedValue([fakePostRow])
        };
        const repo = new PostRepository(fakePool as any);
        const result = await repo.findByAuthor(3, 6);
        const [query, params] = fakePool.query.mock.calls[0] as [string, Record<string, unknown>];
        expect(query).toContain(`posts.author_id=:targetId`);
        expect(query).toContain('visible_for');

        expect(params).toEqual({userId: 3, targetId: 6});
        expect(result).toMatchObject(expect.objectContaining({authorId: 6}));
    });

    it('Should return user post row when both of ids are equal', async () => {
        const fakePostRow = mockPostRow({id: 2, authorId: 3});
        const fakePool = {
            query: vi.fn().mockResolvedValue([[fakePostRow]])
        };
        const repo = new PostRepository(fakePool as any);
        const result = await repo.findByAuthor(3, 3);
        const [query, params] = fakePool.query.mock.calls[0] as [string, Record<string, unknown>];
        expect(query).not.toContain(`posts.visible_for = 'Public' AND posts.author_id=:targetId`);
        expect(query).toContain('WHERE posts.author_id =:userId');
        expect(params).toEqual({userId: 3});
        expect(result).toContainEqual(expect.objectContaining({authorId: 3}));
    });
});

describe('insert', () => {
    it('Should pass when query is correct and provided input params are the same as in .execute', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new PostRepository(fakePool as any);
        const result = await repo.insert({
            authorId: 5,
            content: "Test content",
            visible_for: "Public",
            photo: ['a.jpg', 'b.png', 'video.svg'],
            file: ['file.js'],
            gif: ['random.gif'],
            pinned_place: 'Mielec',
            tagged_users: [12, 16],
            video: ['test.mp4']
        });
        const [query, params] = fakePool.execute.mock.calls[0] as [string, Record<string, unknown>];
        expect(query).toContain('INSERT INTO posts');
        expect(params).toEqual({
            authorId: 5, content: 'Test content', visible_for: 'Public', photo: JSON.stringify(['a.jpg', 'b.png', 'video.svg']), file: JSON.stringify(['file.js']), gif: JSON.stringify(['random.gif']), pinned_place: 'Mielec', tagged_users: JSON.stringify([12, 16]),
            video: JSON.stringify(['test.mp4'])
        });
        expect(result).toBe(true);
    });
    it('Should pass when query is correct and provided input params are the same as in .execute (Optional Parameters)', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new PostRepository(fakePool as any);
        const result = await repo.insert({
            authorId: 5,
            content: "Test content",
            visible_for: "Public",
        });
        const [query, params] = fakePool.execute.mock.calls[0] as [string, Record<string, unknown>];
        expect(query).toContain('INSERT INTO posts');
        expect(params).toMatchObject({authorId: 5, content: 'Test content', visible_for: 'Public'});
        expect(result).toBe(true);
    });
});

describe('update', () => {
    it('Should pass when query is correct and provided input params are the same as in .execute', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new PostRepository(fakePool as any);
        const result = await repo.update(4, {
            content: "Updated content",
            visible_for: "Public",
            photo: ['a.jpg', 'b.png', 'video.svg'],
            file: ['file.js'],
            gif: ['random.gif'],
            pinned_place: 'Mielec',
            tagged_users: [12, 16],
            video: ['test.mp4']
        });
        const [query, params] = fakePool.execute.mock.calls[0] as [string, Record<string, unknown>];
        expect(query).toContain('UPDATE posts');
        expect(query).toContain('WHERE id=:id');
        expect(params).toEqual({
            id: 4, content: 'Updated content', visible_for: 'Public', photo: JSON.stringify(['a.jpg', 'b.png', 'video.svg']), file: JSON.stringify(['file.js']), gif: JSON.stringify(['random.gif']), pinned_place: 'Mielec', tagged_users: JSON.stringify([12, 16]),
            video: JSON.stringify(['test.mp4'])
        });
        expect(result).toBe(true);
    });
    it('Should pass when query is correct and provided input params are the same as in .execute (Optional parameters)', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new PostRepository(fakePool as any);
        const result = await repo.update(4, {
            content: "Updated content",
            visible_for: "Public"
        });
        const [query, params] = fakePool.execute.mock.calls[0] as [string, Record<string, unknown>];
        expect(query).toContain('UPDATE posts');
        expect(query).toContain('WHERE id=:id');
        expect(params).toEqual({id: 4, content: 'Updated content', visible_for: 'Public'});
        expect(result).toBe(true);
    });
    it('Should return false when DTO contains not allowed keys and params not have params', async () => {
        const fakePool = {
            execute: vi.fn()
        };
        const repo = new PostRepository(fakePool as any);
        await expect(repo.update(4, {
            author_Id: 4,
        } as any)).resolves.toBe(false);
        expect(fakePool.execute).not.toHaveBeenCalled();

    });
});

describe('delete', () => {
    it('Should pass when query contains key clausules and passed args are the same', async () => {
        const fakePool = {
            execute: vi.fn().mockResolvedValue([{affectedRows: 1}])
        };
        const repo = new PostRepository(fakePool as any);
        const result = await repo.delete(4);
        const [query, params] = fakePool.execute.mock.calls[0] as [string, Record<string, unknown>];
        expect(query).toContain('DELETE FROM posts');
        expect(query).toContain('WHERE id=:id');
        expect(params).toMatchObject({id: 4});
        expect(result).toBe(true);
    });
});
describe('findAll', () => {
    let fakeDbRows: IMockedPostRow[] = [];
    beforeAll(() => {
        for (let i = 0; i < 4; i++) {
            const mockedRow = mockPostRow({
                id: i,
                authorId: 3
            });
            fakeDbRows.push(mockedRow);
        }
    });
    afterAll(() => {
        fakeDbRows = [];
    });
    it('Should pass when both of arguments provided correctly', async () => {

        const fakePool = {
            query: vi.fn().mockResolvedValue([fakeDbRows])
        };
        const repo = new PostRepository(fakePool as any);
        const result = await repo.findAll(3);
        const [query, params] = fakePool.query.mock.calls[0] as [string, Record<string, unknown>];
        expect(query).toContain(`posts.visible_for = 'Friends'`);
        expect(query).toContain(`posts.visible_for = 'Private' AND posts.author_id=:userId`);
        expect(params).toEqual({userId: 3});
        expect(result).toContainEqual(expect.objectContaining({authorId: 3}));
    });
});
