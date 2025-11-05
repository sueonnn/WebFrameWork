export type BasePlaceType = 'SCHOOL' | 'COMPANY' | 'HOME';

export interface CreateGroupDTO {
  name: string;
  description?: string;
  basePlaceType: BasePlaceType | null;
  baseAddress?: string;
}