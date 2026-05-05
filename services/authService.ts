import api from './api';
import { AuthUser } from '../types';

const USE_MOCK = !process.env.EXPO_PUBLIC_API_URL;

const mockAuthUser: AuthUser = {
  id: 'me',
  email: 'user@tripmate.app',
  nickname: '김지은',
  token: 'mock_token_123',
};

export async function login(email: string, password: string): Promise<AuthUser> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return mockAuthUser;
  }
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function signup(email: string, password: string, nickname: string): Promise<AuthUser> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return { ...mockAuthUser, email, nickname };
  }
  const { data } = await api.post('/auth/signup', { email, password, nickname });
  return data;
}

export async function socialLogin(provider: 'google' | 'apple' | 'kakao', token: string): Promise<AuthUser> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    return mockAuthUser;
  }
  const { data } = await api.post('/auth/social', { provider, token });
  return data;
}
