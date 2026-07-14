import type { currentUser } from "./interface/user/types.ts";

declare module 'express' {
    interface Request {
        currentUser?:currentUser
    }
}

