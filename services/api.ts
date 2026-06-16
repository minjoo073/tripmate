import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authEvents } from './authEvents';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.tripmate.app/v1';

const api = axios.create({
  baseURL: BASE_URL,
  // 60s: 무료 호스팅(Render)은 비활성 시 서버가 잠들어 첫 요청이 최대 ~50초 걸린다.
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const stored = await AsyncStorage.getItem('auth_user');
  if (stored) {
    const { token } = JSON.parse(stored);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      authEvents.emit('logout');
    }
    return Promise.reject(err);
  },
);

export default api;
