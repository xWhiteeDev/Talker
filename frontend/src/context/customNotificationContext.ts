import { createContext } from "react";
import type {CustomNotificationContext} from "../types/Context";

export const customNotificationCtx= createContext<CustomNotificationContext | undefined>(undefined);