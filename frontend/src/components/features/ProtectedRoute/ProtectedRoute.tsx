import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { refreshToken } from "../../../lib/API/refreshToken";
import { Loading } from "../../generic/UI/Loading/Loading";

type AuthorizationStatus = "Unauthorized" | "Authorized" | "Checking";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const nav = useNavigate();
  const [status, setStatus] = useState<AuthorizationStatus>("Checking");

  useEffect(() => {
    refreshToken().then((result) =>
      setStatus(result.requiresLogin ? "Unauthorized" : "Authorized"),
    );
  }, []);

  useEffect(() => {
    if (status === "Unauthorized") {
      nav("/auth/login");
    }
  }, [status]);
  if (status === "Checking") {
    return <Loading />;
  }
  if (status === "Unauthorized") return null;
  return children;
}
