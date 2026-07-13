import type {ResultSetHeader, Pool} from "mysql2/promise";
import type {FriendsRelation, FriendsRelationInsertDTO, FriendsRelationRow, FriendsRelationUpdateDTO, IFriendshipRepository} from "../interface/repository/FriendshipRepository.js";

export class friendshipRepository implements IFriendshipRepository {
    constructor(private pool: Pool) {

    }
    async findById(id: number): Promise<FriendsRelation | undefined> {
        const query: string = 'SELECT * FROM friendships WHERE id=:id LIMIT 1';
        const [[result]] = await this.pool.query<FriendsRelationRow[]>(query, {id});
        return result as FriendsRelation | undefined;
    }
    async findByUserId(userId: number): Promise<FriendsRelation[] | undefined> {
        const query: string = 'SELECT * FROM friendships WHERE userId=:userId OR friendId=:userId';
        const [result] = await this.pool.query<FriendsRelationRow[]>(query, {userId});
        return result as FriendsRelation[] | undefined;
    }
    async findRelationBetween(userId: number, otherId: number): Promise<FriendsRelation | undefined> {
        const query: string = 'SELECT * FROM friendships WHERE(userId=:userId AND friendId=:otherId) OR (userId=:otherId and friendId=:userId) LIMIT 1';
        const [[result]] = await this.pool.query<FriendsRelationRow[]>(query, {userId, otherId});
        return result as FriendsRelation | undefined;
    }
    async insert(dto: FriendsRelationInsertDTO): Promise<boolean> {
        const query: string = 'INSERT INTO friendships (userId,friendId,status) VALUES (:userId,:friendId,:status)';
        const [result] = await this.pool.execute<ResultSetHeader>(query, {userId: dto.userId, friendId: dto.friendId, status: dto.status});
        return result.affectedRows > 0;
    }
    async update(userId: number, otherId: number, {status}: FriendsRelationUpdateDTO): Promise<boolean> {
        const query: string = 'UPDATE friendships SET status=:status WHERE(userId=:userId AND friendId=:otherId) OR (userId=:otherId and friendId=:userId)';
        const [result] = await this.pool.execute<ResultSetHeader>(query, {userId, otherId, status});
        return result.affectedRows > 0;
    }
    async delete(userId: number, otherId: number): Promise<boolean> {
        const query: string = 'DELETE FROM friendships WHERE(userId=:userId AND friendId=:otherId) OR (userId=:otherId and friendId=:userId)';
        const [result] = await this.pool.execute<ResultSetHeader>(query, {userId, otherId});
        return result.affectedRows > 0;
    }

}