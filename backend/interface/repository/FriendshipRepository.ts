import type {RowDataPacket} from "mysql2";

export interface IFriendshipRepository {
    findById(id: number): Promise<FriendsRelation | undefined>;
    findByUserId(userId: number): Promise<FriendsRelation[] | undefined>;
    insert(dto: FriendsRelationInsertDTO): Promise<boolean>;
    update(userId: number,otherId:number, dto: FriendsRelationUpdateDTO): Promise<boolean>;
    delete(userId: number, otherId:number): Promise<boolean>;
    findRelationBetween(userId: number, otherId: number): Promise<FriendsRelationRow | undefined>;
}


export interface FriendsRelationRow extends RowDataPacket {
    id: number;
    userId: number;
    friendId: number;
    status: FriendsRelationStatus;
    created_at: number;

}

export interface FriendsRelation extends Exclude<FriendsRelationRow, 'constructor'> {
}

export interface FriendsRelationInsertDTO {
    userId: number;
    friendId: number;
    status: FriendsRelationStatus;
}

export interface FriendsRelationUpdateDTO extends Pick<FriendsRelationInsertDTO, 'status'> {
}

type FriendsRelationStatus = 'inprogress' | 'related';
