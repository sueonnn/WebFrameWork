import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import MainPage from "../pages/MainPage";
import GroupCreatePage from "../pages/GroupCreatePage";
import LoginPage from "../pages/LoginPage";
import DecisionPage from "../pages/DecisionPage";
import HistoryPage from "../pages/HistoryPage";
import SchedulePage from '../pages/SchedulePage';
import GroupTimelinePage from '../pages/GroupTimelinePage';
import GroupPlaceRecommendPage from "../pages/GroupPlaceRecommendPage";
import StationCafePage from "../pages/StationCafePage";
import CheckListPage from "../pages/CheckList";  
import HistoryDetailPage from "../pages/HistoryDetailPage";  

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <MainPage /> },
      { path: '/groups/new', element: <GroupCreatePage /> },
      { path: '/groups/schedule', element: <SchedulePage /> },
      { path: "/groups/timeline", element: <GroupTimelinePage /> },
      { path: "/groups/checklist/:meetingId", element: <CheckListPage /> },
      { path: "/groups/checkstory/:meetingId", element: <HistoryDetailPage /> },
      { path: "/groups/:groupId/decide", element: <DecisionPage /> },
      { path: '/history', element: <HistoryPage /> },
      { path: "/groups/recommend", element: <GroupPlaceRecommendPage /> },
      { path: "/stations/cafes", element: <StationCafePage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
