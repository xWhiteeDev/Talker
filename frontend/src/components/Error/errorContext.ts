import { createContext } from "react";
import type { ErrorContext } from "./types";

export const ServerErrorContext = createContext<ErrorContext | undefined>(undefined)