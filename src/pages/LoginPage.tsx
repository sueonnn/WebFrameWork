import React from "react";
import AuthLayout from "../layout/AuthLayout";
import AuthPanel from "../components/specific/AuthPanel";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1">
        <AuthLayout>
          <AuthPanel />
        </AuthLayout>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
