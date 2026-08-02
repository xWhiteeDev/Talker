import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {emitServer} from "../../../lib/API/emitServer";

interface AuthorizationProtectedRouteProps {
    children:React.ReactNode
}

export default function AuthorizationProtectedRoute({
  children,
}: AuthorizationProtectedRouteProps) {
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
  return isAuthorised ? <span>Redirecting...</span> : children;
}
