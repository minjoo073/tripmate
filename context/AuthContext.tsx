import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser } from '../types';
import { authEvents } from '../services/authEvents';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (patch: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
  updateUser: async () => {},
});

/**
 * JWT 의 payload 파트(두 번째 segment)를 파싱한다.
 * atob 는 Hermes(Expo 기본 JS 엔진)에서 전역으로 제공된다.
 * base64url → base64 패딩 정규화 후 JSON.parse.
 */
function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    // globalThis.atob 는 Hermes(React Native 0.64+) / Expo SDK 47+ 에서 제공된다.
    // lib: ESNext 에는 타입 선언이 없으므로 globalThis 캐스트 사용.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json = (globalThis as any).atob(padded) as string;
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** exp 클레임(Unix 초)을 현재 시각과 비교해 만료 여부를 반환한다. */
function isTokenExpired(token: string): boolean {
  const payload = parseJwtPayload(token);
  if (!payload) return true; // 파싱 불가 → 유효하지 않은 토큰으로 처리
  const exp = payload.exp;
  if (exp == null) return false; // exp 없으면 만료 없는 토큰
  return (exp as number) * 1000 < Date.now();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // AsyncStorage 에서 세션 복원 + JWT exp 검증
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('auth_user');
        if (stored) {
          const parsed: AuthUser = JSON.parse(stored);
          if (isTokenExpired(parsed.token)) {
            // 만료된 토큰은 즉시 제거하고 로그인 화면으로
            await AsyncStorage.removeItem('auth_user');
          } else {
            setUser(parsed);
          }
        }
      } catch {
        // 읽기/파싱 실패 시 무시 — setIsLoading(false) 는 finally 에서 보장
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // api.ts 의 401 인터셉터가 emit 한 'logout' 이벤트 구독
  useEffect(() => {
    const handleForceLogout = async () => {
      await AsyncStorage.removeItem('auth_user');
      setUser(null);
    };
    authEvents.on('logout', handleForceLogout);
    return () => authEvents.off('logout', handleForceLogout);
  }, []);

  const signIn = async (authUser: AuthUser) => {
    await AsyncStorage.setItem('auth_user', JSON.stringify(authUser));
    setUser(authUser);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('auth_user');
    setUser(null);
  };

  const updateUser = async (patch: Partial<AuthUser>) => {
    if (!user) return;
    const next = { ...user, ...patch };
    setUser(next);
    await AsyncStorage.setItem('auth_user', JSON.stringify(next)).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
