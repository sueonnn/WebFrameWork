import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import MainPage from "../pages/MainPage";
import GroupCreatePage from "../pages/GroupCreatePage";
import LoginPage from "../pages/LoginPage";
import DecisionPage from "../pages/DecisionPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "/groups/new", element: <GroupCreatePage /> },
      // { path: '/groups/:groupId', element: <GroupDetailPage /> }, // 추후 연결
      { path: "/groups/:groupId/decide", element: <DecisionPage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
