import api from './api';

const USE_MOCK = !process.env.EXPO_PUBLIC_API_URL;

/** DB의 TravelPersonality 7개 Int 필드 (id/userId/updatedAt 제외). */
export interface PersonalityInts {
  pace:      number;
  time:      number;
  companion: number;
  stay:      number;   // 프론트 accommodation → DB stay
  dining:    number;
  plan:      number;   // 프론트 planning → DB plan
  budget:    number;
}

/**
 * 내 성향 조회.
 * mock 모드: null 반환 (PersonalityContext 가 AsyncStorage 폴백 사용).
 * real 모드: GET /users/me/personality.
 */
export async function getMyPersonality(): Promise<PersonalityInts | null> {
  if (USE_MOCK) return null;
  const { data } = await api.get<PersonalityInts>('/users/me/personality');
  return data;
}

/**
 * 내 성향 저장.
 * mock 모드: no-op (PersonalityContext 가 AsyncStorage 에 직접 저장).
 * real 모드: PUT /users/me/personality.
 */
export async function updateMyPersonality(ints: PersonalityInts): Promise<void> {
  if (USE_MOCK) return;
  await api.put('/users/me/personality', ints);
}
