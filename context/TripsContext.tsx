import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedTrip {
  destination: string;
  startDate: string;
  endDate: string;
  themes?: string[];
  companions?: string;
  memo?: string;
  // When set, this trip is treated as a completed/past trip rather than upcoming.
  completedAt?: string;
}

// Seed past trips so a fresh user sees a few boarding passes immediately.
// Replaced by real history as the user accumulates trips.
const SEED_HISTORY: SavedTrip[] = [
  {
    destination: '오사카, 일본',
    startDate: '2025-06-15',
    endDate: '2025-06-19',
    themes: ['카페 투어', '맛집 탐방'],
    companions: '조승연',
    memo: '',
    completedAt: '2025-06-19',
  },
  {
    destination: '방콕, 태국',
    startDate: '2024-12-20',
    endDate: '2024-12-25',
    themes: ['현지 시장', '액티비티'],
    companions: '한소희',
    memo: '',
    completedAt: '2024-12-25',
  },
];

interface TripsContextType {
  upcoming: SavedTrip | null;
  history: SavedTrip[];
  recent: SavedTrip[];
  reload: () => Promise<void>;
  clear: () => Promise<void>;
}

const TripsContext = createContext<TripsContextType>({
  upcoming: null,
  history: SEED_HISTORY,
  recent: SEED_HISTORY,
  reload: async () => {},
  clear: async () => {},
});

function sortByStartDesc(trips: SavedTrip[]): SavedTrip[] {
  return [...trips].sort((a, b) => (b.startDate || '').localeCompare(a.startDate || ''));
}

export function TripsProvider({ children }: { children: React.ReactNode }) {
  const [upcoming, setUpcoming] = useState<SavedTrip | null>(null);
  const [history, setHistory] = useState<SavedTrip[]>(SEED_HISTORY);

  const reload = useCallback(async () => {
    try {
      const [stored, hist] = await Promise.all([
        AsyncStorage.getItem('trip_plan'),
        AsyncStorage.getItem('trip_history'),
      ]);
      setUpcoming(stored ? JSON.parse(stored) : null);
      if (hist) {
        const parsed: SavedTrip[] = JSON.parse(hist);
        setHistory(parsed.length > 0 ? parsed : SEED_HISTORY);
      } else {
        setHistory(SEED_HISTORY);
      }
    } catch {
      setUpcoming(null);
      setHistory(SEED_HISTORY);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const clear = useCallback(async () => {
    await Promise.all([
      AsyncStorage.removeItem('trip_plan').catch(() => {}),
      AsyncStorage.removeItem('trip_history').catch(() => {}),
    ]);
    setUpcoming(null);
    setHistory(SEED_HISTORY);
  }, []);

  // upcoming first (if any), then most recent history.
  const recent = (upcoming ? [upcoming, ...sortByStartDesc(history)] : sortByStartDesc(history)).slice(0, 3);

  return (
    <TripsContext.Provider value={{ upcoming, history, recent, reload, clear }}>
      {children}
    </TripsContext.Provider>
  );
}

export function useTrips() {
  return useContext(TripsContext);
}
