import {createContext} from "react";
import type {IAuthContext} from "../types/Context";

export const AuthContext = createContext<IAuthContext | undefined>(undefined)


