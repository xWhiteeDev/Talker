import {ErrorHandler} from "../../handlers/errorHandler.js";
import type {IFriendshipService, IFriendshipRepository, FriendsRelation, FriendsRelationInsertDTO, FriendsRelationUpdateDTO} from "./types.js";

export class friendshipService implements IFriendshipService {
    constructor(private FriendRepository: IFriendshipRepository) {

    }
    async findRelationById(id: number): Promise<FriendsRelation> {
        const existingRelation = await this.FriendRepository.findById(id);
        if (!existingRelation) throw new ErrorHandler('Relation not found', 400);
        return existingRelation;
    }
    async findRelationByUserId(id: number): Promise<FriendsRelation[]> {
        const existingRelation = await this.FriendRepository.findByUserId(id);
        if (!existingRelation) throw new ErrorHandler('Relations not found', 400);
        return existingRelation;
    }
    async findRelationBetween(userId: number, otherId: number): Promise<FriendsRelation> {
        const existingRelation = await this.FriendRepository.findRelationBetween(userId, otherId);
        if (!existingRelation) throw new ErrorHandler('Relation not found', 400);
        return existingRelation;
    }
    async insertRelation(dto: FriendsRelationInsertDTO): Promise<boolean> {
        if (dto.userId === dto.friendId) throw new ErrorHandler('Cannot add yourself as friend', 400);

        const existingRelation = await this.FriendRepository.findRelationBetween(dto.userId, dto.friendId);
        if (existingRelation) throw new ErrorHandler('Relation found with exact user', 400);
        const result = await this.FriendRepository.insert(dto);
        return result;
    }
    async updateRelation(userId: number, friendId: number, dto: FriendsRelationUpdateDTO): Promise<boolean> {
        const existingRelation = await this.FriendRepository.findRelationBetween(userId, friendId);
        if (!existingRelation) throw new ErrorHandler('Relation not found with exact user', 400);
        if (existingRelation.friendId !== userId) throw new ErrorHandler('Cannot accept yourself ', 403);
        const result = await this.FriendRepository.update(userId, friendId, dto);
        return result;
    }
    async acceptRelation(userId: number, otherId: number): Promise<boolean> {
        const existingRelation = await this.FriendRepository.findRelationBetween(userId, otherId);
        if (!existingRelation) throw new ErrorHandler('Relation not found with exact user', 400);
        if (userId !== existingRelation.friendId) throw new ErrorHandler('You cannot accept relation offer sent by you', 403);
        const result = await this.FriendRepository.update(userId, otherId, {status: 'accepted'});
        return result;
    }
    async removeRelation(userId: number, otherId: number): Promise<boolean> {
        const existingRelation = await this.FriendRepository.findRelationBetween(userId, otherId);
        if (!existingRelation) throw new ErrorHandler('Relation not found with exact user', 400);
        const result = await this.FriendRepository.delete(userId, otherId);
        return result;
    }


}