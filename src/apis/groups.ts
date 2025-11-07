import type { CreateGroupDTO, CreateGroupResponse } from '../types/group';

export async function apiCreateGroup(dto: CreateGroupDTO): Promise<CreateGroupResponse> {
    const res = await fetch('/api/groups', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Create group failed: ${msg}`);
  }
  return res.json() as Promise<CreateGroupResponse>;
}