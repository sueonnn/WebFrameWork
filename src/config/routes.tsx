import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import MainPage from '../pages/MainPage';
import GroupCreatePage from "../pages/GroupCreatePage";
import LoginPage from "../pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <MainPage /> }, 
      { path: "/groups/new", element: <GroupCreatePage /> }, 
      // { path: '/groups/:groupId', element: <GroupDetailPage /> }, // 추후 연결
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
