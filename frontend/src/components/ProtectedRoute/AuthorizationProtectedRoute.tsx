import { useEffect, useState } from "react";
import type { AuthorizationProtectedRoute } from "./types";
import { emitServer } from "../../lib/API/fetch";
import { useNavigate } from "react-router-dom";

export default function AuthorizationProtectedRoute({
  children,
}: AuthorizationProtectedRoute) {
  const nav = useNavigate();
  const [isAuthorised, setAuthorised] = useState<unknown>(undefined);
  useEffect(() => {
    emitServer("/api/auth/isAuth", "GET").then((data) => setAuthorised(!!data));
  }, []);
  useEffect(() => {
    if (isAuthorised) {
      nav("/home");
    }
  }, [isAuthorised]);
  return isAuthorised ? <span>Przekierowywanie...</span> : children;
}
