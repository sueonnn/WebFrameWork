
import { UsersIcon } from '../icons';

export default function GroupJoinForm() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="rounded-full bg-indigo-100 p-4 mb-4">
        <UsersIcon />
      </div>

      <h2 className="text-lg font-semibold">그룹에 참여하기</h2>
      <p className="text-sm text-gray-500 mt-1">
        친구가 공유한 8자리 초대코드를 입력해주세요
      </p>

      <input
        placeholder="ABC12345"
        className="mt-5 w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none focus:border-indigo-500"
      />

      <button className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700">
        <UsersIcon />
        그룹 참여하기
      </button>

      <div className="mt-3 w-full rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-600">
        초대코드가 없나요? 그룹 관리자에게 요청하거나 새 그룹을 만들어보세요.
      </div>
    </div>
  );
}
