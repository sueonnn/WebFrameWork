import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface RequireAuthProps {
  children: React.ReactElement;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?mode=login&redirect=${redirectTo}`} replace />;
  }

  return children;
};

export default RequireAuth;
