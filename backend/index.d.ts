import type {otherUser} from "./dependencies/Account/types.ts";
import type { currentUser } from "./interface/user/types.ts";

declare module 'express' {
    interface Request {
        currentUser?:currentUser;
        otherUserId?: number
    }
}

