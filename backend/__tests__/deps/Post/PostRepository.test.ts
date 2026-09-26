import {describe, expect, it, vi} from "vitest";
import type {PostRow} from "../../../dependencies/Post/types.js";
import {PostRepository} from "../../../dependencies/Post/postRepository.js";

describe('findById', () => {
    it('Should return post row without details', async () => {
        const fakePostRow = {
            id: 2,
            createdAt: "22/09/2026",
            authorId: 6,
            content: "Siema siema",
            visible_for: "Public",
            fullName: "Json Alvaro",
            reactions: {'like': 5, 'love': 10, 'wow': 55},
            myReaction: "like",
            commentsCount: 4,
            photo: null,
            video: null,
            file: null,
            gif: null,
            taggedUsers: null,
            pinnedPlace: null
        };
        const fakePool = {
            query: vi.fn().mockResolvedValue([[fakePostRow]])
        };

        const repo = new PostRepository(fakePool as any);
        await repo.findById(6, 4);
        const [query, params] = fakePool.query.mock.calls[0] as any;
        expect(query).toContain('posts.id = :id');
        expect(query).toContain("posts.visible_for = 'Friends'");
        expect(query).toContain("posts.visible_for = 'Private'");
        expect(params).toEqual({id: 6, currentUserId: 4});
    });
});