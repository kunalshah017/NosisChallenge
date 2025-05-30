import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BookProgress {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  totalPages: number;
  currentPage: number;
  percentCompleted: number;
  timeSpentReading: number; // in minutes
  lastReadDate: string;
  dateStarted: string;
  dateCompleted?: string;
  notes?: string;
}

interface ReadingProgressState {
  incompleteBooks: BookProgress[];
  completedBooks: BookProgress[];

  // Actions
  startReadingBook: (
    book: Omit<
      BookProgress,
      'currentPage' | 'percentCompleted' | 'timeSpentReading' | 'lastReadDate' | 'dateStarted'
    >
  ) => void;
  updateReadingProgress: (bookId: string, currentPage: number, timeSpent: number) => void;
  completeBook: (bookId: string) => void;
  removeIncompleteBook: (bookId: string) => void;
  addBookNote: (bookId: string, note: string) => void;

  // Getters
  getBookProgress: (bookId: string) => BookProgress | undefined;
  getTotalBooksInProgress: () => number;
  getRecentlyRead: (limit?: number) => BookProgress[];
  getCurrentlyReading: () => BookProgress[];
}

export const useReadingProgressStore = create<ReadingProgressState>()(
  persist(
    (set, get) => ({
      incompleteBooks: [],
      completedBooks: [],

      startReadingBook: (book) =>
        set((state) => {
          const existingBook = state.incompleteBooks.find((b) => b.id === book.id);
          if (existingBook) return state; // Book already in progress

          const newBook: BookProgress = {
            ...book,
            currentPage: 0,
            percentCompleted: 0,
            timeSpentReading: 0,
            lastReadDate: new Date().toISOString(),
            dateStarted: new Date().toISOString(),
          };

          return {
            incompleteBooks: [...state.incompleteBooks, newBook],
          };
        }),

      updateReadingProgress: (bookId, currentPage, timeSpent) =>
        set((state) => {
          const bookIndex = state.incompleteBooks.findIndex((book) => book.id === bookId);
          if (bookIndex === -1) return state;

          const book = state.incompleteBooks[bookIndex];
          const percentCompleted = Math.min((currentPage / book.totalPages) * 100, 100);

          const updatedBooks = [...state.incompleteBooks];
          updatedBooks[bookIndex] = {
            ...book,
            currentPage,
            percentCompleted,
            timeSpentReading: book.timeSpentReading + timeSpent,
            lastReadDate: new Date().toISOString(),
          };

          return { incompleteBooks: updatedBooks };
        }),

      completeBook: (bookId) =>
        set((state) => {
          const bookIndex = state.incompleteBooks.findIndex((book) => book.id === bookId);
          if (bookIndex === -1) return state;

          const completedBook = {
            ...state.incompleteBooks[bookIndex],
            percentCompleted: 100,
            currentPage: state.incompleteBooks[bookIndex].totalPages,
            dateCompleted: new Date().toISOString(),
          };

          const newIncompleteBooks = state.incompleteBooks.filter((book) => book.id !== bookId);

          return {
            incompleteBooks: newIncompleteBooks,
            completedBooks: [...state.completedBooks, completedBook],
          };
        }),

      removeIncompleteBook: (bookId) =>
        set((state) => ({
          incompleteBooks: state.incompleteBooks.filter((book) => book.id !== bookId),
        })),

      addBookNote: (bookId, note) =>
        set((state) => {
          const updateBooks = (books: BookProgress[]) =>
            books.map((book) => (book.id === bookId ? { ...book, notes: note } : book));

          return {
            incompleteBooks: updateBooks(state.incompleteBooks),
            completedBooks: updateBooks(state.completedBooks),
          };
        }),

      getBookProgress: (bookId) => {
        const state = get();
        return state.incompleteBooks.find((book) => book.id === bookId);
      },

      getTotalBooksInProgress: () => {
        const state = get();
        return state.incompleteBooks.length;
      },

      getRecentlyRead: (limit = 5) => {
        const state = get();
        return [...state.incompleteBooks, ...state.completedBooks]
          .sort((a, b) => new Date(b.lastReadDate).getTime() - new Date(a.lastReadDate).getTime())
          .slice(0, limit);
      },

      getCurrentlyReading: () => {
        const state = get();
        return state.incompleteBooks.filter((book) => book.currentPage > 0);
      },
    }),
    {
      name: 'reading-progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper hook
export const useReadingProgress = () => {
  const {
    incompleteBooks,
    completedBooks,
    startReadingBook,
    updateReadingProgress,
    completeBook,
    removeIncompleteBook,
    addBookNote,
    getBookProgress,
    getTotalBooksInProgress,
    getRecentlyRead,
    getCurrentlyReading,
  } = useReadingProgressStore();

  return {
    incompleteBooks,
    completedBooks,
    startReadingBook,
    updateReadingProgress,
    completeBook,
    removeIncompleteBook,
    addBookNote,
    getBookProgress,
    getTotalBooksInProgress,
    getRecentlyRead,
    getCurrentlyReading,
  };
};
