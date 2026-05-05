import api from './api';
import { FindMateFilter, MatchResult, User } from '../types';
import { mockMatchResults, mockUsers } from '../mock/data';

const USE_MOCK = !process.env.EXPO_PUBLIC_API_URL;

export async function findMates(filter: FindMateFilter): Promise<MatchResult[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 2000));
    return mockMatchResults;
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
