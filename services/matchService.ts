import api from './api';
import { FindMateFilter, MatchResult, User } from '../types';
import { mockMatchResults, mockUsers } from '../mock/data';

const USE_MOCK = !process.env.EXPO_PUBLIC_API_URL;

function ageBucket(age: number): '20대' | '30대' | '40대+' | '기타' {
  if (age >= 20 && age < 30) return '20대';
  if (age >= 30 && age < 40) return '30대';
  if (age >= 40) return '40대+';
  return '기타';
}

export async function findMates(filter: FindMateFilter): Promise<MatchResult[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 2000));
    let result = mockMatchResults;

    if (filter.destination) {
      const term = filter.destination.toLowerCase();
      result = result.filter((m) =>
        m.trip.destination.toLowerCase().includes(term) ||
        (m.trip.country ?? '').toLowerCase().includes(term)
      );
    }
    if (filter.travelStyles?.length) {
      result = result.filter((m) =>
        filter.travelStyles.some((s) => m.user.travelStyles.includes(s))
      );
    }
    if (filter.gender && filter.gender !== '무관') {
      const wanted = filter.gender === '여성' ? 'female' : 'male';
      result = result.filter((m) => m.user.gender === wanted);
    }
    if (filter.ageGroup && filter.ageGroup !== '무관') {
      result = result.filter((m) => ageBucket(m.user.age) === filter.ageGroup);
    }
    if (filter.verifiedOnly) {
      result = result.filter((m) => m.user.isVerified);
    }
    return result;
  }
  const { data } = await api.post('/match/find', filter);
  return data;
}

export async function getMateProfile(userId: string): Promise<User> {
  if (USE_MOCK) {
    const user = mockUsers.find((u) => u.id === userId) ?? mockUsers[0];
    return user;
  }
  const { data } = await api.get(`/users/${userId}`);
  return data;
}

export async function likeMate(userId: string): Promise<void> {
  if (USE_MOCK) return;
  await api.post(`/users/${userId}/like`);
}

export async function getRecommended(): Promise<MatchResult[]> {
  if (USE_MOCK) return mockMatchResults.slice(0, 3);
  const { data } = await api.get('/match/recommended');
  return data;
}
