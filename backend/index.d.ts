import type {currentUser, otherUser} from "./dependencies/Account/types.ts";

declare module 'express' {
    interface Request {
        currentUser?:currentUser;
        otherUserId?: number
    }
}

