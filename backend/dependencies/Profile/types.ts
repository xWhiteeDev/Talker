import type { Request, Response, NextFunction } from 'express';
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
  relation?:IProfileRelation | null
}
interface IProfileBody {
  id: number;
}

interface IProfileRelation {
  status:null |'pending' | 'accepted';
  creator:number
}
export type { IProfileService, IProfileController, IProfile, IProfileBody };
