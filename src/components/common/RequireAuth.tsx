// src/components/common/RequireAuth.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface RequireAuthProps {
  children: React.ReactElement;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isLoggedIn, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return null;
  }

  if (!isLoggedIn) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?mode=login&redirect=${redirectTo}`} replace />;
  }

  return children;
};

export default RequireAuth;
