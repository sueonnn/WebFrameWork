import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { GROUPS, MEETINGS } from "../mock";
import { Users, Calendar, MapPin, LogOut, Clock, Copy} from "lucide-react";

const MyPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [copiedGroupId, setCopiedGroupId] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 초대 코드 복사
  const handleCopyInviteCode = async (groupId: string, inviteCode?: string) => {
    if (!inviteCode) return;

    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopiedGroupId(groupId);
      setTimeout(() => setCopiedGroupId(null), 1500);
    } catch (e) {
      alert("클립보드 복사에 실패했어요. 직접 복사해 주세요.");
    }
  };

  // 로그인 안 되어 있으면 로그인 페이지 유도
  if (!user) {
    return (
      <section className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center px-4">
        <p className="mb-4 text-gray-700 text-center">
          마이페이지는 로그인 후 이용할 수 있어요.
        </p>
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 transition"
          onClick={() => navigate("/login?mode=login")}
        >
          로그인 하러가기
        </button>
      </section>
    );
  }

  // 내가 속한 그룹들
  const myGroups = useMemo(
    () => GROUPS.filter((g: any) => g.memberIds.includes(user.id)),
    [user.id]
  );

  // 그룹별 미팅 리스트
  const meetingsByGroup = useMemo(() => {
    const map: Record<string, any[]> = {};
    myGroups.forEach((g: any) => {
      map[g.id] = MEETINGS.filter((m: any) => m.groupId === g.id);
    });
    return map;
  }, [myGroups]);

  return (
    <section className="min-h-screen bg-[#F9FAFB] py-10">
      <div className="mx-auto max-w-5xl px-4 space-y-8">
        {/* 상단 프로필 영역 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-xl font-bold text-indigo-600">
                {user.name?.[0] ?? "유"}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {user.name} 님
              </h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              onClick={() => navigate("/history")}
            >
              히스토리 보러가기
            </button>
            <button
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md shadow-md hover:bg-red-600 transition"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>
        </div>

        {/* 내가 참여한 그룹들 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 text-indigo-600 mr-2" />
            <h2 className="text-lg font-bold text-gray-900">
              내가 참여한 그룹
            </h2>
          </div>

          {myGroups.length === 0 ? (
            <p className="text-sm text-gray-500">
              아직 참여 중인 그룹이 없어요. 초대 코드를 받아 그룹에 참여해
              보세요!
            </p>
          ) : (
            <div className="space-y-4">
              {myGroups.map((group: any) => {
                const meetings = meetingsByGroup[group.id] ?? [];

                return (
                  <div
                    key={group.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-md font-bold text-gray-900">
                          {group.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {group.description}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                        {group.memberIds.length}명 참여 중
                      </span>
                    </div>

                    {group.inviteCode && (
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-[11px] text-gray-500">
                          초대 코드{" "}
                          <span className="font-mono font-semibold text-gray-800">
                            {group.inviteCode}
                          </span>
                        </p>
                        <button
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full hover:bg-indigo-100 transition"
                          onClick={() =>
                            handleCopyInviteCode(group.id, group.inviteCode)
                          }
                        >
                          <Copy className="w-3 h-3" />
                          {copiedGroupId === group.id ? "복사됨!" : "복사"}
                        </button>
                      </div>
                    )}

                    {meetings.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {meetings.slice(0, 3).map((meeting: any) => (
                          <div
                            key={meeting.id}
                            className="flex items-start justify-between text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{meeting.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{meeting.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{meeting.location}</span>
                              </div>
                            </div>
                            <div className="text-right space-y-0.5">
                              <p className="text-[11px] text-gray-500">
                                {meeting.participants}
                              </p>
                              <span
                                className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] ${meeting.statusClasses}`}
                              >
                                {meeting.status}
                              </span>
                            </div>
                          </div>
                        ))}

                        {meetings.length > 3 && (
                          <button
                            className="mt-2 text-xs text-indigo-600 hover:underline"
                            onClick={() => navigate("/history")}
                          >
                            더 많은 모임 보기 →
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyPage;
