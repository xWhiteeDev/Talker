import { useNavigate } from "react-router-dom";
import { emitServer } from "../lib/API/fetch";
import type { EmitData, EmitMethod } from "../lib/API/types";
import { ErrorHandler } from "../lib/customError";
import { useContext } from "react";
import { ServerErrorContext } from "../components/Error/errorContext";

export function useAPI() {
  const nav = useNavigate();
  const context = useContext(ServerErrorContext);
  async function request<T>(url: string, method: EmitMethod, data?: EmitData) {
    try {
      const result = await emitServer<T>(url, method, data);
      return result;
    } catch (error) {
      if (error instanceof ErrorHandler) {
        if (error.code == 401) {
          nav("/auth/login");
          return;
        }
        if (error.code == 403) {
          nav("/home");
          return;
        }
        if (error.code >= 500 && error.code < 600) {
          context?.setServerError(true);
          return;
        }
      } else {
        context?.setServerError(true);
      }
    }
  }
  return { request };
}
