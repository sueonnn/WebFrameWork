import React, { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex mx-auto max-w-6xl w-full min-h-[80vh] py-12 px-4">
      <div className="hidden lg:block flex-shrink-0 w-1/2 bg-indigo-600 p-12 text-white rounded-l-xl shadow-2xl min-h-full">
        <h2 className="text-4xl font-extrabold mb-8">언제봐</h2>
        <div className="space-y-6 text-lg font-medium">
          <p>모두의 공강시간을 한눈에</p>
          <p>시간 조율의 스트레스 제로</p>
          <p>가장 가까운 만남의 장소</p>
          <p>협업 친화적인 결정 과정</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-white rounded-r-xl shadow-2xl border border-l-0 border-gray-200 min-h-full">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
