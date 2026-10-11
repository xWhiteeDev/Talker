import type {ICurrentUser} from "./dependencies/Account/types.ts";




interface IResponseJSONDeclaration {
    success: boolean;
    data?: unknown;
    message?:string
}


declare module 'express' {
    interface Request {
        currentUser?: ICurrentUser;
        otherUserId?: number;
    }
    interface Response {
        json(declaration: IResponseJSONDeclaration);
    }
}

