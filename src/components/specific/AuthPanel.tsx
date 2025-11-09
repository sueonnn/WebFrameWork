import React, { useState } from "react";
import LoginPanel from "./LoginPanel";
import SignupPanel from "./SignupPanel";

const AuthPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  return (
    <div className="w-full max-w-sm bg-white rounded-lg shadow-xl overflow-hidden h-[650px]">
      {/* 탭 헤더 */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 text-center text-lg font-semibold transition duration-150 ${
            activeTab === "login"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-indigo-600"
          }`}
          onClick={() => setActiveTab("login")}
        >
          로그인
        </button>
        <button
          className={`flex-1 py-3 text-center text-lg font-semibold transition duration-150 ${
            activeTab === "signup"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-indigo-600"
          }`}
          onClick={() => setActiveTab("signup")}
        >
          회원가입
        </button>
      </div>

      {/* 탭 내용 */}
      <div className="p-4">
        {activeTab === "login" && <LoginPanel />}
        {activeTab === "signup" && <SignupPanel />}
      </div>
    </div>
  );
};

export default AuthPanel;
