import type { Request, Response, NextFunction } from 'express';
import type { IAcceptedRelationRow } from '../Friendship/types.js';
interface IProfileService {
  get(userId: number, requestedId: number): Promise<IProfile>;
}
interface IProfileController {
  getUser(req: Request, res: Response, next: NextFunction): Promise<boolean>;
}
interface IProfile {
  fullName: string;
  birthdayDate: string;
  joinDate: string;
  description: string;
  content: any; //ANY REMOVE
  relation?: IProfileRelation | null;
  friends: IAcceptedRelationRow[] | null;
}
interface IProfileBody {
  id: number;
}

interface IProfileRelation {
  status: null | 'pending' | 'accepted';
  creator: number;
}
export type { IProfileService, IProfileController, IProfile, IProfileBody };
