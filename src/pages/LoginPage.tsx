import React from "react";
import AuthLayout from "../layout/AuthLayout";
import AuthPanelWithRedirect from "../components/specific/AuthPanelWithRedirect";

const LoginPage: React.FC = () => {
  return (
    <AuthLayout>
      <AuthPanelWithRedirect />
    </AuthLayout>
  );
};

export default LoginPage;
