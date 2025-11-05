import React from "react";
import { Eye } from "lucide-react";

const SignupPanel: React.FC = () => {
  return (
    <div className="flex flex-col space-y-4 p-8">
      {/* 이름 입력 */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          이름
        </label>
        <input
          id="name"
          type="text"
          placeholder="홍길동"
          className="p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* 이메일 입력 */}
      <div className="flex flex-col space-y-1">
        <label
          htmlFor="signup-email"
          className="text-sm font-medium text-gray-700"
        >
          이메일
        </label>
        <input
          id="signup-email"
          type="email"
          placeholder="name@school.ac.kr"
          className="p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* 비밀번호 입력 */}
      <div className="flex flex-col space-y-1">
        <label
          htmlFor="signup-password"
          className="text-sm font-medium text-gray-700"
        >
          비밀번호
        </label>
        <div className="relative">
          <input
            id="signup-password"
            type="password"
            placeholder="8자 이상 + 숫자/문자 포함"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 pr-10"
          />
          <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer" />
        </div>
      </div>

      {/* 비밀번호 확인 */}
      <div className="flex flex-col space-y-1">
        <label
          htmlFor="confirm-password"
          className="text-sm font-medium text-gray-700"
        >
          비밀번호 확인
        </label>
        <div className="relative">
          <input
            id="confirm-password"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 pr-10"
          />
          <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer" />
        </div>
      </div>

      {/* 약관 동의 체크박스 */}
      <div className="flex items-start pt-2">
        <input
          id="terms"
          type="checkbox"
          className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
          <span className="font-semibold text-indigo-600 hover:underline cursor-pointer">
            이용약관
          </span>
          에 동의합니다.
        </label>
      </div>

      <div className="flex items-start pt-2">
        <input
          id="terms"
          type="checkbox"
          className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
          <span className="font-semibold text-indigo-600 hover:underline cursor-pointer">
            개인정보 처리방침
          </span>
          에 동의합니다.
        </label>
      </div>

      {/* 회원가입 버튼 */}
      <button className="w-full py-3 mt-4 text-white font-semibold bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 transition duration-150">
        회원가입
      </button>
    </div>
  );
};

export default SignupPanel;
