export type BasePlaceType = 'SCHOOL' | 'COMPANY' | 'HOME';

export interface CreateGroupDTO {
  name: string;
  description?: string;
  basePlaceType: BasePlaceType | null;
  baseAddress?: string;
  baseLatitude?: number;  
  baseLongitude?: number;   
}

export interface CreateGroupResponse {
  id: string;
  inviteCode: string; // 8자리 영문+숫자
}