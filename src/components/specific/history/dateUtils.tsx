export const parseKoreanDate = (dateString: string): Date => {
  const match = dateString.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  if (match) {
    const [, year, month, day] = match;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  return new Date(0); // 파싱 실패 시 기본값
};

export const compareDates = (
  dateA: string,
  dateB: string,
  order: 'asc' | 'desc' = 'desc'
): number => {
  const timeA = parseKoreanDate(dateA).getTime();
  const timeB = parseKoreanDate(dateB).getTime();
  
  return order === 'desc' ? timeB - timeA : timeA - timeB;
};