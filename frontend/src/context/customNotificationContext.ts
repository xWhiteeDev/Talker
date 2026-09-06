import { createContext } from "react";
import type {ICustomNotificationContext} from "../types/context/IContext";

export const CustomNotificationCtx= createContext<ICustomNotificationContext | undefined>(undefined);