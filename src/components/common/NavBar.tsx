import React from "react";
import { Bell, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const menuItems = [
    { name: "홈", path: "/" },
    { name: "히스토리", path: "/history" },
    { name: "그룹 참여하기", path: "/groups/new?tab=join" },
  ];

  const logoName = "언제봐";

  return (
    <nav className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-baseline space-x-8">
        <NavLink to="/" className="text-lg font-bold text-indigo-600">
          {logoName}
        </NavLink>

        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `text-lg font-semibold ${
                isActive
                  ? "text-indigo-600"
                  : "text-gray-700 hover:text-indigo-600"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 transition duration-150"
              onClick={() => navigate("/groups/new")}
            >
              모임 만들기
            </button>
            <Bell className="w-6 h-6 text-gray-500 cursor-pointer hover:text-indigo-600" />
            {/* ✅ 아이콘 클릭 시 마이페이지로 이동 */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/mypage")}
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-800">
                {user?.name ?? "사용자"}
              </span>
            </div>
          </>
        ) : (
          <>
            <button
              className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition duration-150"
              onClick={() => navigate("/login?mode=login")}
            >
              로그인
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 transition duration-150"
              onClick={() => navigate("/login?mode=signup")}
            >
              회원가입
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
