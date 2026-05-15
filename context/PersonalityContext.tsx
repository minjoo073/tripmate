import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Personality {
  pace:          string;
  time:          string;
  companion:     string;
  accommodation: string;
  dining:        string;
  planning:      string;
  budget:        string;
}

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
}

const PersonalityContext = createContext<PersonalityContextType>({
  personality: DEFAULT,
  save: async () => {},
});

export function PersonalityProvider({ children }: { children: React.ReactNode }) {
  const [personality, setPersonality] = useState<Personality>(DEFAULT);

  useEffect(() => {
    AsyncStorage.getItem('personality').then((stored) => {
      if (stored) setPersonality({ ...DEFAULT, ...JSON.parse(stored) });
    }).catch(() => {});
  }, []);

  async function save(p: Personality) {
    setPersonality(p);
    await AsyncStorage.setItem('personality', JSON.stringify(p)).catch(() => {});
  }

  return (
    <PersonalityContext.Provider value={{ personality, save }}>
      {children}
    </PersonalityContext.Provider>
  );
}

export function usePersonality() {
  return useContext(PersonalityContext);
}
