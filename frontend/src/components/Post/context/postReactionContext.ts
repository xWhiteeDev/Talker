import {createContext} from "react";
import type {PostReactionContext} from "./types";

export const postReactionContext = createContext<PostReactionContext | undefined>(undefined);