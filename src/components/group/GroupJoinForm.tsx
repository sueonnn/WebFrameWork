import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { UsersIcon } from '../icons';
import { GROUPS } from "../../mock"; 

export default function GroupJoinForm() {
  const [joinedGroupId, setJoinedGroupId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [canGoSchedule, setCanGoSchedule] = useState(false);

  const navigate = useNavigate();

  const handleJoinClick = () => {
    const trimmed = code.trim().toUpperCase();

    if (trimmed === "") {
      setModalMessage("초대 코드를 입력한 후에 눌러주세요.");
      setShowModal(true);
      return;
    }
    if (trimmed.length < 8) {
      setModalMessage("초대 코드는 8자리여야 합니다.");
      setShowModal(true);
      return;
    }

    const group = GROUPS.find((g) => g.inviteCode === trimmed);

    if (!group) {
      setModalMessage("해당 초대코드를 가진 그룹을 찾을 수 없어요.");
      setShowModal(true);
      return;
    }

    // 참여 성공 연출
    console.log("참여 코드:", trimmed, "=> 그룹:", group);

    setJoinedGroupId(group.id); 
    setModalMessage(`"${group.name}" 그룹에 참여했어요!`);
    setCanGoSchedule(true);  
    setShowModal(true);


  };

   const handleModalClose = () => {
    setShowModal(false);
    if (canGoSchedule) {
      navigate(`/groups/${joinedGroupId}/timeline`);
      setCanGoSchedule(false);      
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 영어 또는 숫자만 허용 (정규식)
    const value = e.target.value.toUpperCase(); // 자동 대문자 변환
    const regex = /^[A-Z0-9]*$/;

    // 8자리까지만 허용
    if (regex.test(value) && value.length <= 8) {
      setCode(value);
    }
  };

  return (
    <div className="flex flex-col w-full h-full px-8 py-16 justify-between">
      {/* 상단 영역 */}
      <div className="flex flex-col items-center text-center">
        <div className="rounded-full bg-indigo-100 p-4 mb-5">
          <UsersIcon className="w-6 h-6 text-indigo-600" />
        </div>
        <h2 className="text-lg font-semibold">그룹에 참여하기</h2>
        <p className="text-sm text-gray-500 mt-1">
          친구가 공유한 8자리 초대코드를 입력해주세요
        </p>
      </div>

      {/* 입력 + 버튼 + 하단 안내 묶음 */}
      <div className="flex flex-col w-full items-center mt-12 space-y-8">
        <input
          value={code}
          onChange={handleChange}
          placeholder="ABC12345"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 text-center"
        />

        <button 
          onClick={handleJoinClick}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700">
          <UsersIcon className="w-4 h-4" />
          그룹 참여하기
        </button>

        <div className="w-full rounded-xl bg-indigo-50 px-4 py-2 text-xs text-indigo-600">
          초대코드가 없나요? 그룹 관리자에게 요청하거나 새 그룹을 만들어보세요.
        </div>
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg px-6 py-5 w-72 text-center">
            <p className="text-sm text-gray-800">{modalMessage}</p>
            <button
              onClick={handleModalClose}
              className="mt-4 w-full rounded-lg bg-indigo-600 text-white text-sm py-2 hover:bg-indigo-700"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
