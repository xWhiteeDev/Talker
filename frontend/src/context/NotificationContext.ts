import { createContext } from "react";
import type { INotificationContext } from "../interfaces/context/INotificationContext";

export const NotificationContext = createContext<INotificationContext | undefined>(undefined);