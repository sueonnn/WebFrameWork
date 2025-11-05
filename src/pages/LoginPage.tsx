import React from "react";
import AuthLayout from "../components/layout/AuthLayout";
import AuthPanel from "../components/specific/AuthPanel";

const LoginPage: React.FC = () => {
  return (
    <AuthLayout>
      <AuthPanel />
    </AuthLayout>
  );
};

export default LoginPage;
