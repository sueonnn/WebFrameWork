// config/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import MainPage from "../pages/MainPage";
import GroupCreatePage from "../pages/GroupCreatePage";
import LoginPage from "../pages/LoginPage";
import DecisionPage from "../pages/DecisionPage";
import HistoryPage from "../pages/HistoryPage";
import SchedulePage from "../pages/SchedulePage";
import GroupTimelinePage from "../pages/GroupTimelinePage";
import GroupPlaceRecommendPage from "../pages/GroupPlaceRecommendPage";
import StationCafePage from "../pages/StationCafePage";
import CheckListPage from "../pages/CheckList";
import HistoryDetailPage from "../pages/HistoryDetailPage";
import MyPage from "../pages/MyPage";
import RequireAuth from "../components/common/RequireAuth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // 누구나 볼 수 있는 페이지
      { index: true, element: <MainPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/groups/recommend", element: <GroupPlaceRecommendPage /> },
      { path: "/stations/cafes", element: <StationCafePage /> },

      // 로그인 필수 페이지
      {
        path: "/mypage",
        element: (
          <RequireAuth>
            <MyPage />
          </RequireAuth>
        ),
      },
      {
        path: "/groups/new",
        element: (
          <RequireAuth>
            <GroupCreatePage />
          </RequireAuth>
        ),
      },
      {
        path: "/groups/:groupId/schedule/:memberId",
        element: (
          <RequireAuth>
            <SchedulePage />
          </RequireAuth>
        ),
      },
      {
        path: "/groups/:groupId/timeline",
        element: (
          <RequireAuth>
            <GroupTimelinePage />
          </RequireAuth>
        ),
      },
      {
        path: "/groups/checklist/:meetingId",
        element: (
          <RequireAuth>
            <CheckListPage />
          </RequireAuth>
        ),
      },
      {
        path: "/groups/checkstory/:meetingId",
        element: (
          <RequireAuth>
            <HistoryDetailPage />
          </RequireAuth>
        ),
      },
      {
        path: "/groups/:groupId/decide",
        element: (
          <RequireAuth>
            <DecisionPage />
          </RequireAuth>
        ),
      },
      {
        path: "/history",
        element: (
          <RequireAuth>
            <HistoryPage />
          </RequireAuth>
        ),
      },
    ],
  },
]);
