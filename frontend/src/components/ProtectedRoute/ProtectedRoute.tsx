import { useNavigate } from "react-router-dom";
import { refreshToken } from "../../lib/API/token";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }:{children:React.ReactNode}) {
  const nav = useNavigate();

  const [neededLogin, setNeededLogin] = useState<
    { success: boolean; requiresLogin: boolean } | undefined
  >(undefined);
  useEffect(() => {
    refreshToken().then((res) => {
      setNeededLogin(res);
    });
  }, []);
  useEffect(() => {
    if (neededLogin?.requiresLogin) {
      nav("/auth/login");
    }
  }, [neededLogin]);
  return neededLogin?.requiresLogin ? <span>Oczekiwanie...</span> : children ;
}
