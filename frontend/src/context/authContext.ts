import {createContext} from "react";
import type {IAuthContext} from "../types/context/IContext";

export const AuthContext = createContext<IAuthContext | undefined>(undefined)


