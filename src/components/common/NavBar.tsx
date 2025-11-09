import React from "react";
import { Bell, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const NavBar: React.FC = () => {
  const menuItems = [
    { name: "홈", path: "/" },
    { name: "히스토리", path: "/history" },
    { name: "그룹 선택", path: "/groups" }, // 예시 경로
  ];

  const logoName = "언제봐";

  return (
    <nav className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-baseline space-x-8">
        <NavLink
          to="/"
          className="text-lg font-bold text-indigo-600" 
        >
          {logoName}
        </NavLink>

        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `text-lg font-semibold ${
                isActive
                  ? "text-indigo-600" // 활성화 시
                  : "text-gray-700 hover:text-indigo-600" // 비활성화 시
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 transition duration-150">
          모임 만들기
        </button>
        <Bell className="w-6 h-6 text-gray-500 cursor-pointer hover:text-indigo-600" />
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer">
          <User className="w-5 h-5 text-white" />
          <span className="text-sm font-medium text-white">S</span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;