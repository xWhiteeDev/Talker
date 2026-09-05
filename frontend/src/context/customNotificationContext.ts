import { createContext } from "react";
import type {CustomNotificationContext} from "../types/Context";

export const CustomNotificationCtx= createContext<CustomNotificationContext | undefined>(undefined);