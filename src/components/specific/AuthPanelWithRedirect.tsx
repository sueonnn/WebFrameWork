import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AuthPanel from "./AuthPanel";

const AuthPanelWithRedirect: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectTo, { replace: true });
    }
  }, [isLoggedIn, redirectTo, navigate]);

  return <AuthPanel />;
};

export default AuthPanelWithRedirect;
