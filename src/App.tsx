import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 중앙 정렬: 가로 정중앙, 위쪽 여백 48px */}
      <main className="mx-auto max-w-5xl px-4 pt-12">
        <Outlet />
      </main>
    </div>
  );
}