import type { NextFunction, Response, Request } from 'express';
import type { RowDataPacket } from 'mysql2';

export interface IFriendshipRepository {
  findById(id: number): Promise<FriendsRelation | undefined>;
  findByUserId(userId: number): Promise<FriendsRelation[] | undefined>;
  insert(dto: FriendsRelationInsertDTO): Promise<boolean>;
  update(userId: number, otherId: number, dto: FriendsRelationUpdateDTO): Promise<boolean>;
  delete(userId: number, otherId: number): Promise<boolean>;
  findRelationBetween(userId: number, otherId: number, status?: string): Promise<FriendsRelationRow | undefined>;
  findAllAcceptedRelations(requestedId: number): Promise<IAcceptedRelationRow[] | undefined>;
}
export interface IFriendshipService {
  findRelationById(id: number): Promise<FriendsRelation  | null>;
  findRelationByUserId(id: number): Promise<FriendsRelation[]  | null>;
  findRelationBetween(userId: number, otherId: number, status?: string): Promise<FriendsRelation | null>;
  findAllAcceptedRelations(userId: number): Promise<IAcceptedRelationRow[] | null>;
  insertRelation(dto: FriendsRelationInsertDTO): Promise<boolean>;
  updateRelation(userId: number, otherId: number, dto: FriendsRelationUpdateDTO): Promise<boolean>;
  removeRelation(userId: number, otherId: number): Promise<boolean>;
  acceptRelation(userId: number, otherId: number): Promise<boolean>;
}

export interface IFriendshipController {
  areInRelation(req: Request, res: Response, next: NextFunction): Promise<boolean>;
  setRelation(req: Request, res: Response, next: NextFunction): Promise<boolean>;
  removeRelation(req: Request, res: Response, next: NextFunction): Promise<boolean>;
  acceptRelation(req: Request, res: Response, next: NextFunction): Promise<boolean>;
}

export interface FriendsRelationRow extends RowDataPacket {
  id: number;
  userId: number;
  friendId: number;
  status: FriendsRelationStatus;
  created_at: number;
}

export interface FriendsRelation extends Exclude<FriendsRelationRow, 'constructor'> {}

export interface FriendsRelationInsertDTO {
  userId: number;
  friendId: number;
  status: FriendsRelationStatus;
}

export interface FriendsRelationUpdateDTO extends Pick<FriendsRelationInsertDTO, 'status'> {}

export type FriendsRelationStatus = 'pending' | 'accepted';
export interface IAcceptedRelationRow extends RowDataPacket {
  otherUserId: number;
  fullName: string;
}
