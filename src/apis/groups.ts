import type { CreateGroupDTO, CreateGroupResponse } from '../types/group';

export async function apiCreateGroup(dto: CreateGroupDTO): Promise<CreateGroupResponse> {
  const res = await fetch('/api/groups', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// 초대코드 참여
export async function apiJoinByCode(code: string, uid: string) {
  const res = await fetch('/api/groups/join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, uid }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ id: string; name: string }>;
}
