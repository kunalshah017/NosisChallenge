import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'en' | 'es' | 'fr' | 'de';

interface PreferencesState {
  // Theme & UI
  themeMode: ThemeMode;
  language: Language;
  fontSize: number;

  // Reading preferences
  autoBookmark: boolean;
  readingReminders: boolean;
  dailyReadingGoal: number; // minutes

  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  setFontSize: (size: number) => void;
  setAutoBookmark: (enabled: boolean) => void;
  setReadingReminders: (enabled: boolean) => void;
  setDailyReadingGoal: (minutes: number) => void;
  resetPreferences: () => void;
}

const defaultPreferences = {
  themeMode: 'system' as ThemeMode,
  language: 'en' as Language,
  fontSize: 16,
  autoBookmark: false,
  readingReminders: false,
  dailyReadingGoal: 30,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      // Initial state
      ...defaultPreferences,

      // Actions
      setThemeMode: (mode) => set({ themeMode: mode }),
      setLanguage: (language) => set({ language }),
      setFontSize: (size) => set({ fontSize: Math.max(12, Math.min(24, size)) }),
      setAutoBookmark: (enabled) => set({ autoBookmark: enabled }),
      setReadingReminders: (enabled) => set({ readingReminders: enabled }),
      setDailyReadingGoal: (minutes) => set({ dailyReadingGoal: Math.max(5, minutes) }),
      resetPreferences: () => set(defaultPreferences),
    }),
    {
      name: 'user-preferences',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper hooks
export const useThemePreferences = () => {
  const { themeMode, setThemeMode } = usePreferencesStore();
  return { themeMode, setThemeMode };
};

export const useLanguagePreferences = () => {
  const { language, setLanguage } = usePreferencesStore();
  return { language, setLanguage };
};

export const useReadingPreferences = () => {
  const {
    fontSize,
    autoBookmark,
    readingReminders,
    dailyReadingGoal,
    setFontSize,
    setAutoBookmark,
    setReadingReminders,
    setDailyReadingGoal,
  } = usePreferencesStore();

  return {
    fontSize,
    autoBookmark,
    readingReminders,
    dailyReadingGoal,
    setFontSize,
    setAutoBookmark,
    setReadingReminders,
    setDailyReadingGoal,
  };
};
