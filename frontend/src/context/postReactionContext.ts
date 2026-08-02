import {createContext} from "react";
import type {PostReactionContext} from "../types/Context";

export const postReactionCtx = createContext<PostReactionContext | undefined>(undefined);
