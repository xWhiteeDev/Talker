import type {FriendsRelation, FriendsRelationInsertDTO, FriendsRelationUpdateDTO} from "../repository/FriendshipRepository.js";

export interface IFriendshipService {
    findRelationById(id: number): Promise<FriendsRelation>;
    findRelationByUserId(id: number): Promise<FriendsRelation[]>;
    findRelationBetween(userId: number, otherId: number): Promise<FriendsRelation>;
    insertRelation( dto: FriendsRelationInsertDTO): Promise<boolean>;
    updateRelation(userId: number,otherId:number, dto: FriendsRelationUpdateDTO): Promise<boolean>;
    deleteRelation(userId: number, otherId: number): Promise<boolean>;
}