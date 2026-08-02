import { useNavigate } from "react-router-dom";
import { emitServer } from "../lib/API/emitServer";
import { ErrorHandler } from "../lib/customError";
import type {EmitMethod, EmitData} from "../types/API";

export function useAPI() {
  const nav = useNavigate();
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
        throw error
      } 
    }
  }
  return { request };
}
