import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import GroupCreatePage from "../pages/GroupCreatePage";
import LoginPage from "../pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <GroupCreatePage /> }, // 임시 홈 = 그룹 생성
      { path: "/groups/new", element: <GroupCreatePage /> }, // 정식 경로
      // { path: '/groups/:groupId', element: <GroupDetailPage /> }, // 추후 연결
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
