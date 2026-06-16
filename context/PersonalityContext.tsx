import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import {
  PersonalityInts,
  getMyPersonality,
  updateMyPersonality,
} from '../services/personalityService';

export interface Personality {
  pace:          string;
  time:          string;
  companion:     string;
  accommodation: string;
  dining:        string;
  planning:      string;
  budget:        string;
}

// ─── 레이블↔정수 매핑 (단일 출처) ────────────────────────────────────────────
// 각 튜플: [레이블, 정수값]
// 역매핑(정수→레이블)은 fromInt() 에서 가장 가까운 구간으로 처리.

const PACE_MAP:          readonly [string, number][] = [['느긋한', 0], ['적당히', 50], ['바쁘게', 100]];
const TIME_MAP:          readonly [string, number][] = [['아침형', 0], ['상관없음', 50], ['저녁형', 100]];
const COMPANION_MAP:     readonly [string, number][] = [['항상 함께', 0], ['적당히 함께', 50], ['각자 자유롭게', 100]];
const ACCOMMODATION_MAP: readonly [string, number][] = [['호텔', 0], ['잠만 자면', 50], ['현지 숙소', 100]];
const DINING_MAP:        readonly [string, number][] = [['현지 맛집', 0], ['특별한 식사', 50], ['간편하게', 100]];
const PLANNING_MAP:      readonly [string, number][] = [['꼼꼼한 계획', 0], ['큰 틀만', 50], ['완전 즉흥', 100]];
const BUDGET_MAP:        readonly [string, number][] = [['알뜰하게', 0], ['가성비', 50], ['경험에 투자', 100]];

function toInt(label: string, map: readonly [string, number][]): number {
  const found = map.find(([l]) => l === label);
  return found !== undefined ? found[1] : 50;
}

function fromInt(val: number, map: readonly [string, number][]): string {
  const exact = map.find(([, n]) => n === val);
  if (exact) return exact[0];
  // 가장 가까운 구간으로 반올림
  let closest = map[0]!;
  let minDiff = Math.abs(map[0]![1] - val);
  for (const entry of map) {
    const diff = Math.abs(entry[1] - val);
    if (diff < minDiff) { minDiff = diff; closest = entry; }
  }
  return closest[0];
}

/** Personality(한글 레이블) → PersonalityInts(DB 정수, DB 필드명) */
export function toInts(p: Personality): PersonalityInts {
  return {
    pace:      toInt(p.pace,          PACE_MAP),
    time:      toInt(p.time,          TIME_MAP),
    companion: toInt(p.companion,     COMPANION_MAP),
    stay:      toInt(p.accommodation, ACCOMMODATION_MAP),
    dining:    toInt(p.dining,        DINING_MAP),
    plan:      toInt(p.planning,      PLANNING_MAP),
    budget:    toInt(p.budget,        BUDGET_MAP),
  };
}

/** PersonalityInts(DB 정수) → Personality(한글 레이블) */
export function fromInts(ints: PersonalityInts): Personality {
  return {
    pace:          fromInt(ints.pace,      PACE_MAP),
    time:          fromInt(ints.time,      TIME_MAP),
    companion:     fromInt(ints.companion, COMPANION_MAP),
    accommodation: fromInt(ints.stay,      ACCOMMODATION_MAP),
    dining:        fromInt(ints.dining,    DINING_MAP),
    planning:      fromInt(ints.plan,      PLANNING_MAP),
    budget:        fromInt(ints.budget,    BUDGET_MAP),
  };
}

// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT: Personality = {
  pace:          '느긋한',
  time:          '저녁형',
  companion:     '적당히 함께',
  accommodation: '현지 숙소',
  dining:        '현지 맛집',
  planning:      '큰 틀만',
  budget:        '가성비',
};

interface PersonalityContextType {
  personality: Personality;
  save: (p: Personality) => Promise<void>;
  reset: () => Promise<void>;
}

const PersonalityContext = createContext<PersonalityContextType>({
  personality: DEFAULT,
  save: async () => {},
  reset: async () => {},
});

export function PersonalityProvider({ children }: { children: React.ReactNode }) {
  const [personality, setPersonality] = useState<Personality>(DEFAULT);
  const { user } = useAuth();

  // Step 1: AsyncStorage에서 로컬 값 복원 (항상)
  useEffect(() => {
    AsyncStorage.getItem('personality').then((stored) => {
      if (stored) setPersonality({ ...DEFAULT, ...JSON.parse(stored) });
    }).catch(() => {});
  }, []);

  // Step 2: 로그인 상태에서 서버 성향 동기화 (real 모드만 실제 호출)
  useEffect(() => {
    if (!user) return;
    getMyPersonality()
      .then((ints) => {
        if (!ints) return; // mock 모드 → null, AsyncStorage 값 유지
        const fromServer = fromInts(ints);
        setPersonality(fromServer);
        AsyncStorage.setItem('personality', JSON.stringify(fromServer)).catch(() => {});
      })
      .catch(() => {}); // 실패 시 AsyncStorage 값 유지
  }, [user]);

  async function save(p: Personality) {
    setPersonality(p);
    await AsyncStorage.setItem('personality', JSON.stringify(p)).catch(() => {});
    if (user) {
      // real 모드: 서버 동기화, mock 모드: updateMyPersonality 가 no-op
      await updateMyPersonality(toInts(p)).catch(() => {});
    }
  }

  async function reset() {
    setPersonality(DEFAULT);
    await AsyncStorage.removeItem('personality').catch(() => {});
  }

  return (
    <PersonalityContext.Provider value={{ personality, save, reset }}>
      {children}
    </PersonalityContext.Provider>
  );
}

export function usePersonality() {
  return useContext(PersonalityContext);
}
