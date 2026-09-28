import {describe, expect, it, vi} from 'vitest';
import {friendshipRepository} from '../../../dependencies/Friendship/friendshipRepository.js';

describe('findById', () => {
  it('should return relation when found', async () => {
    const fakeRow = {id: 3, userId: 1, friendId: 2, status: 'accepted', created_at: 0};
    const fakePool = {
      query: vi.fn().mockResolvedValue([[fakeRow]]),
    };
    const repo = new friendshipRepository(fakePool as any);
    const result = await repo.findById(3);
    expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE id=:id LIMIT 1'), {id: 3});
    expect(result).toBe(fakeRow);
  });

  it('should return undefined when relation not found', async () => {
    const fakePool = {
      query: vi.fn().mockResolvedValue([[]]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await expect(repo.findById(3)).resolves.toBeUndefined();
  });
});

describe('findByUserId', () => {
  it('should look for relations where user is sender or receiver', async () => {
    const fakeRows = [
      {id: 1, userId: 4, friendId: 2, status: 'accepted'},
      {id: 2, userId: 7, friendId: 4, status: 'pending'},
    ];
    const fakePool = {
      query: vi.fn().mockResolvedValue([fakeRows]),
    };
    const repo = new friendshipRepository(fakePool as any);
    const result = await repo.findByUserId(4);
    expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE userId=:userId OR friendId=:userId'), {userId: 4});
    expect(result).toBe(fakeRows);
  });

  it('should return empty array when user has no relations', async () => {
    const fakePool = {
      query: vi.fn().mockResolvedValue([[]]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await expect(repo.findByUserId(4)).resolves.toEqual([]);
  });
});

describe('findRelationBetween', () => {
  it('should filter by status in both directions when status is provided', async () => {
    const fakePool = {
      query: vi.fn().mockResolvedValue([[]]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await repo.findRelationBetween(1, 2, 'pending');
    const [query, params] = fakePool.query.mock.calls[0] as [string, Record<string, unknown>];
    expect(query).toContain('(userId=:userId AND friendId=:otherId AND status=:status)');
    expect(query).toContain('(userId=:otherId AND friendId=:userId AND status=:status )');
    expect(query).toContain('LIMIT 1');
    expect(params).toEqual({userId: 1, otherId: 2, status: 'pending'});
  });

  it('should not filter by status when status is not provided', async () => {
    const fakePool = {
      query: vi.fn().mockResolvedValue([[]]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await repo.findRelationBetween(1, 2);
    const [query, params] = fakePool.query.mock.calls[0] as [string, Record<string, unknown>];
    expect(query).not.toContain('status=:status');
    expect(query).toContain('(userId=:userId AND friendId=:otherId) OR (userId=:otherId AND friendId=:userId)');
    expect(params).toEqual({userId: 1, otherId: 2, status: undefined});
  });

  it('should return relation when found', async () => {
    const fakeRow = {id: 8, userId: 2, friendId: 1, status: 'pending', created_at: 0};
    const fakePool = {
      query: vi.fn().mockResolvedValue([[fakeRow]]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await expect(repo.findRelationBetween(1, 2, 'pending')).resolves.toBe(fakeRow);
  });

  it('should return undefined when relation not found', async () => {
    const fakePool = {
      query: vi.fn().mockResolvedValue([[]]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await expect(repo.findRelationBetween(1, 2)).resolves.toBeUndefined();
  });
});

describe('findAllAcceptedRelations', () => {
  it('should query accepted relations of the user', async () => {
    const fakeRows = [
      {otherUserId: 2, fullName: 'Max Harris', id: 10},
      {otherUserId: 9, fullName: 'Calvin Harris', id: 4},
    ];
    const fakePool = {
      query: vi.fn().mockResolvedValue([fakeRows]),
    };
    const repo = new friendshipRepository(fakePool as any);
    const result = await repo.findAllAcceptedRelations(1);
    expect(fakePool.query).toHaveBeenCalledWith(`SELECT base.otherUserId, CONCAT(accounts.firstName," ",accounts.lastName) as fullName, base.id FROM (
      SELECT status,id, CASE WHEN userId=:userId THEN friendId ELSE userId END AS otherUserId FROM friendships WHERE (STATUS='accepted' AND (userId=:userId OR friendId=:userId))
    ) as base 
     LEFT JOIN accounts ON accounts.id = base.otherUserId ORDER BY base.id DESC LIMIT 9`, {userId: 1});
    expect(result).toBe(fakeRows);
  });
});

describe('insert', () => {
  it('should insert relation and return true when row was affected', async () => {
    const fakePool = {
      execute: vi.fn().mockResolvedValue([{affectedRows: 1}]),
    };
    const repo = new friendshipRepository(fakePool as any);
    const result = await repo.insert({userId: 1, friendId: 2, status: 'pending'});
    expect(fakePool.execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO friendships (userId,friendId,status) VALUES (:userId,:friendId,:status)'),
      {userId: 1, friendId: 2, status: 'pending'},
    );
    expect(result).toBe(true);
  });

  it('should return false when nothing was inserted', async () => {
    const fakePool = {
      execute: vi.fn().mockResolvedValue([{affectedRows: 0}]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await expect(repo.insert({userId: 1, friendId: 2, status: 'pending'})).resolves.toBe(false);
  });
});

describe('update', () => {
  it('should update status of relation in both directions', async () => {
    const fakePool = {
      execute: vi.fn().mockResolvedValue([{affectedRows: 1}]),
    };
    const repo = new friendshipRepository(fakePool as any);
    const result = await repo.update(1, 2, {status: 'accepted'});
    const [query, params] = fakePool.execute.mock.calls[0] as [string, Record<string, unknown>];
    expect(query).toContain('UPDATE friendships SET status=:status');
    expect(query).toContain('(userId=:userId AND friendId=:otherId) OR (userId=:otherId and friendId=:userId)');
    expect(params).toEqual({userId: 1, otherId: 2, status: 'accepted'});
    expect(result).toBe(true);
  });

  it('should return false when no row was updated', async () => {
    const fakePool = {
      execute: vi.fn().mockResolvedValue([{affectedRows: 0}]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await expect(repo.update(1, 2, {status: 'accepted'})).resolves.toBe(false);
  });
});

describe('delete', () => {
  it('should delete relation in both directions', async () => {
    const fakePool = {
      execute: vi.fn().mockResolvedValue([{affectedRows: 1}]),
    };
    const repo = new friendshipRepository(fakePool as any);
    const result = await repo.delete(1, 2);
    const [query, params] = fakePool.execute.mock.calls[0] as [string, Record<string, unknown>];
    expect(query).toContain('DELETE FROM friendships');
    expect(query).toContain('(userId=:userId AND friendId=:otherId) OR (userId=:otherId and friendId=:userId)');
    expect(params).toEqual({userId: 1, otherId: 2});
    expect(result).toBe(true);
  });

  it('should return false when no row was deleted', async () => {
    const fakePool = {
      execute: vi.fn().mockResolvedValue([{affectedRows: 0}]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await expect(repo.delete(1, 2)).resolves.toBe(false);
  });
});
