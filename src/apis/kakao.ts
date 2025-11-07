export async function searchPlaces(keyword: string) {
  if (!keyword.trim()) return [];

  const res = await fetch(
    `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(keyword)}`,
    {
      headers: {
        Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_API_KEY}`,
      },
    }
  );
  const data = await res.json();
  return data.documents || [];
}
