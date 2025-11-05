import React from "react";
import { Eye } from "lucide-react";

const LoginPanel: React.FC = () => {
  return (
    <div className="flex flex-col space-y-6 p-8">
      <div className="flex flex-col space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          이메일
        </label>
        <input
          id="email"
          type="email"
          placeholder="name@school.ac.kr"
          className="p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          비밀번호
        </label>
        <div className="relative">
          <input
            id="password"
            type="password"
            placeholder="8자 이상 + 숫자/문자 포함"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 pr-10"
          />
          <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer" />
        </div>
      </div>

      <button className="w-full py-3 mt-4 text-white font-semibold bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 transition duration-150">
        로그인
      </button>

      <a
        href="#"
        className="text-sm text-center text-gray-500 hover:text-indigo-600 mt-4"
      >
        비밀번호를 잊으셨나요?
      </a>
    </div>
  );
};

export default LoginPanel;
