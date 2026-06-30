import { createContext } from "react";
import type { IErrorContext } from "../interfaces/context/IErrorContext";


export const errorContext = createContext<IErrorContext>({ code: 400, message: `Default context message. Don't worry if you see it :)` })