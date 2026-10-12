import {createContext} from "react";
import type {IUserContext} from "./types";

export const userContext = createContext<IUserContext | null>(null);