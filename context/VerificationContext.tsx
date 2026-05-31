import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SEED_VERIFIED = ['phone', 'email'];

interface VerificationContextType {
  verifiedKeys: string[];
  isVerified: (key: string) => boolean;
  setVerified: (key: string, verified: boolean) => Promise<void>;
  reset: () => Promise<void>;
}

const VerificationContext = createContext<VerificationContextType>({
  verifiedKeys: SEED_VERIFIED,
  isVerified: () => false,
  setVerified: async () => {},
  reset: async () => {},
});

export function VerificationProvider({ children }: { children: React.ReactNode }) {
  const [verifiedKeys, setKeys] = useState<string[]>(SEED_VERIFIED);

  useEffect(() => {
    AsyncStorage.getItem('verified_keys').then((stored) => {
      if (stored) setKeys(JSON.parse(stored));
    }).catch(() => {});
  }, []);

  const persist = useCallback(async (next: string[]) => {
    setKeys(next);
    await AsyncStorage.setItem('verified_keys', JSON.stringify(next)).catch(() => {});
  }, []);

  const setVerified = useCallback(async (key: string, verified: boolean) => {
    const current = verifiedKeys;
    const next = verified
      ? (current.includes(key) ? current : [...current, key])
      : current.filter((k) => k !== key);
    await persist(next);
  }, [verifiedKeys, persist]);

  const reset = useCallback(async () => {
    setKeys(SEED_VERIFIED);
    await AsyncStorage.removeItem('verified_keys').catch(() => {});
  }, []);

  const isVerified = useCallback((key: string) => verifiedKeys.includes(key), [verifiedKeys]);

  return (
    <VerificationContext.Provider value={{ verifiedKeys, isVerified, setVerified, reset }}>
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  return useContext(VerificationContext);
}
