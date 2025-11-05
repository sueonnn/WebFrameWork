import React from "react";
import { Bell, User } from "lucide-react";

const NavBar: React.FC = () => {
  const menuItems = ["언제봐", "홈", "히스토리", "그룹 선택"];

  return (
    <nav className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex space-x-8">
        {menuItems.map((item) => (
          <a
            key={item}
            href="#"
            className={`text-lg font-semibold ${
              item === "언제봐"
                ? "text-indigo-600"
                : "text-gray-700 hover:text-indigo-600"
            }`}
          >
            {item}
          </a>
        ))}
      </div>

      {/* 2. 우측 아이콘 및 버튼 */}
      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 transition duration-150">
          모임 만들기
        </button>
        <Bell className="w-6 h-6 text-gray-500 cursor-pointer hover:text-indigo-600" />
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer">
          <User className="w-5 h-5 text-white" />
          {/* 사용자 이니셜 또는 프로필 사진을 위한 공간 */}
          <span className="text-sm font-medium text-white">S</span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
