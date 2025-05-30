import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ReadingStats {
  totalBooksRead: number;
  totalTimeSpent: number; // in minutes
  currentStreak: number; // days
  longestStreak: number; // days
  lastReadDate: string;
  averageReadingSpeed: number; // pages per minute
  totalPagesRead: number;
}

interface ReadingStatsState {
  stats: ReadingStats;

  // Actions
  incrementBooksRead: () => void;
  addReadingTime: (minutes: number) => void;
  addPagesRead: (pages: number) => void;
  updateDayStreak: () => void;
  updateReadingSpeed: (pagesPerMinute: number) => void;
  resetStats: () => void;

  // Getters
  getAverageReadingTime: () => number;
  getBooksReadThisMonth: () => number;
  getReadingGoalProgress: (monthlyGoal: number) => number;
}

const initialStats: ReadingStats = {
  totalBooksRead: 0,
  totalTimeSpent: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastReadDate: '',
  averageReadingSpeed: 0,
  totalPagesRead: 0,
};

export const useReadingStatsStore = create<ReadingStatsState>()(
  persist(
    (set, get) => ({
      stats: initialStats,

      incrementBooksRead: () =>
        set((state) => ({
          stats: {
            ...state.stats,
            totalBooksRead: state.stats.totalBooksRead + 1,
          },
        })),

      addReadingTime: (minutes) =>
        set((state) => ({
          stats: {
            ...state.stats,
            totalTimeSpent: state.stats.totalTimeSpent + minutes,
            lastReadDate: new Date().toISOString(),
          },
        })),

      addPagesRead: (pages) =>
        set((state) => ({
          stats: {
            ...state.stats,
            totalPagesRead: state.stats.totalPagesRead + pages,
          },
        })),

      updateDayStreak: () =>
        set((state) => {
          const today = new Date().toDateString();
          const lastRead = state.stats.lastReadDate
            ? new Date(state.stats.lastReadDate).toDateString()
            : '';
          const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

          let newStreak = state.stats.currentStreak;

          if (lastRead === today) {
            // Already read today, no change
            return state;
          } else if (lastRead === yesterday) {
            // Read yesterday, increment streak
            newStreak = state.stats.currentStreak + 1;
          } else if (lastRead !== yesterday && lastRead !== '') {
            // Missed a day, reset streak
            newStreak = 1;
          } else {
            // First time reading
            newStreak = 1;
          }

          return {
            stats: {
              ...state.stats,
              currentStreak: newStreak,
              longestStreak: Math.max(newStreak, state.stats.longestStreak),
              lastReadDate: new Date().toISOString(),
            },
          };
        }),

      updateReadingSpeed: (pagesPerMinute) =>
        set((state) => ({
          stats: {
            ...state.stats,
            averageReadingSpeed: pagesPerMinute,
          },
        })),

      resetStats: () => set({ stats: initialStats }),

      getAverageReadingTime: () => {
        const state = get();
        return state.stats.totalBooksRead > 0
          ? state.stats.totalTimeSpent / state.stats.totalBooksRead
          : 0;
      },

      getBooksReadThisMonth: () => {
        // This would need additional tracking - simplified for now
        const state = get();
        return state.stats.totalBooksRead;
      },

      getReadingGoalProgress: (monthlyGoal) => {
        const state = get();
        const booksThisMonth = state.stats.totalBooksRead; // Simplified
        return monthlyGoal > 0 ? (booksThisMonth / monthlyGoal) * 100 : 0;
      },
    }),
    {
      name: 'reading-stats-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper hook
export const useReadingStats = () => {
  const {
    stats,
    incrementBooksRead,
    addReadingTime,
    addPagesRead,
    updateDayStreak,
    updateReadingSpeed,
    resetStats,
    getAverageReadingTime,
    getBooksReadThisMonth,
    getReadingGoalProgress,
  } = useReadingStatsStore();

  return {
    stats,
    incrementBooksRead,
    addReadingTime,
    addPagesRead,
    updateDayStreak,
    updateReadingSpeed,
    resetStats,
    getAverageReadingTime,
    getBooksReadThisMonth,
    getReadingGoalProgress,
  };
};
