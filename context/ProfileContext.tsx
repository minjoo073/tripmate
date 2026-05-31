import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Profile {
  avatarIndex: number | null;
  bio: string;
  location: string;
  mbti: string;
  styles: string[];
  personalities: Record<string, 'A' | 'B'>;
  savedPostIds: string[];
  likedPostIds: string[];
}

const DEFAULT: Profile = {
  avatarIndex: null,
  bio: '',
  location: '서울',
  mbti: '',
  styles: [],
  personalities: {},
  savedPostIds: [],
  likedPostIds: [],
};

interface ProfileContextType {
  profile: Profile;
  save: (p: Profile) => Promise<boolean>;
  reset: () => Promise<void>;
  toggleSavedPost: (postId: string) => Promise<void>;
  toggleLikedPost: (postId: string) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: DEFAULT,
  save: async () => false,
  reset: async () => {},
  toggleSavedPost: async () => {},
  toggleLikedPost: async () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(DEFAULT);

  useEffect(() => {
    AsyncStorage.getItem('profile').then((stored) => {
      if (stored) setProfile({ ...DEFAULT, ...JSON.parse(stored) });
    }).catch(() => {});
  }, []);

  async function save(p: Profile): Promise<boolean> {
    setProfile(p);
    try {
      await AsyncStorage.setItem('profile', JSON.stringify(p));
      return true;
    } catch {
      return false;
    }
  }

  async function reset() {
    setProfile(DEFAULT);
    await AsyncStorage.removeItem('profile').catch(() => {});
  }

  async function persistPatch(patch: Partial<Profile>) {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem('profile', JSON.stringify(next)).catch(() => {});
      return next;
    });
  }

  async function toggleSavedPost(postId: string) {
    const current = profile.savedPostIds;
    const next = current.includes(postId) ? current.filter((id) => id !== postId) : [postId, ...current];
    await persistPatch({ savedPostIds: next });
  }

  async function toggleLikedPost(postId: string) {
    const current = profile.likedPostIds;
    const next = current.includes(postId) ? current.filter((id) => id !== postId) : [postId, ...current];
    await persistPatch({ likedPostIds: next });
  }

  return (
    <ProfileContext.Provider value={{ profile, save, reset, toggleSavedPost, toggleLikedPost }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
