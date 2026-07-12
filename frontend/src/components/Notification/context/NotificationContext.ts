import { createContext } from "react";
import type { CustomNotificationContext } from "./types";

export const NotificationContext = createContext<CustomNotificationContext | undefined>(undefined);