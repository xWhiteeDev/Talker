import type {NextFunction,Response,Request} from "express";
import type {RowDataPacket} from "mysql2";

export interface IFriendshipRepository {
    findById(id: number): Promise<FriendsRelation | undefined>;
    findByUserId(userId: number): Promise<FriendsRelation[] | undefined>;
    insert(dto: FriendsRelationInsertDTO): Promise<boolean>;
    update(userId: number, otherId: number, dto: FriendsRelationUpdateDTO): Promise<boolean>;
    delete(userId: number, otherId: number): Promise<boolean>;
    findRelationBetween(userId: number, otherId: number): Promise<FriendsRelationRow | undefined>;
}
export interface IFriendshipService {
    findRelationById(id: number): Promise<FriendsRelation>;
    findRelationByUserId(id: number): Promise<FriendsRelation[]>;
    findRelationBetween(userId: number, otherId: number): Promise<FriendsRelation>;
    insertRelation(dto: FriendsRelationInsertDTO): Promise<boolean>;
    updateRelation(userId: number, otherId: number, dto: FriendsRelationUpdateDTO): Promise<boolean>;
    deleteRelation(userId: number, otherId: number): Promise<boolean>;
}

export interface IFriendshipController {
    areInRelation(req: Request, res: Response, next: NextFunction): Promise<boolean>;
    setRelation(req: Request, res: Response, next: NextFunction): Promise<boolean>;
    changeRelationStatus(req: Request, res: Response, next: NextFunction): Promise<boolean>;
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

export type FriendsRelationStatus = 'inprogress' | 'related' | 'declined';
