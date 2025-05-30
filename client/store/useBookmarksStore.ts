import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BookmarkBook {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  dateBookmarked: string;
}

interface BookmarksState {
  bookmarkedBooks: BookmarkBook[];

  // Actions
  addBookmark: (book: Omit<BookmarkBook, 'dateBookmarked'>) => void;
  removeBookmark: (bookId: string) => void;
  isBookmarked: (bookId: string) => boolean;
  clearAllBookmarks: () => void;
  getBookmarkCount: () => number;
  getBookmarkedBooks: () => BookmarkBook[];
}

export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set, get) => ({
      bookmarkedBooks: [],

      addBookmark: (book) =>
        set((state) => {
          // Prevent duplicates
          if (state.bookmarkedBooks.some((b) => b.id === book.id)) {
            return state;
          }
          return {
            bookmarkedBooks: [
              ...state.bookmarkedBooks,
              { ...book, dateBookmarked: new Date().toISOString() },
            ],
          };
        }),

      removeBookmark: (bookId) =>
        set((state) => ({
          bookmarkedBooks: state.bookmarkedBooks.filter((book) => book.id !== bookId),
        })),

      isBookmarked: (bookId) => {
        const state = get();
        return state.bookmarkedBooks.some((book) => book.id === bookId);
      },

      clearAllBookmarks: () => set({ bookmarkedBooks: [] }),

      getBookmarkCount: () => {
        const state = get();
        return state.bookmarkedBooks.length;
      },

      getBookmarkedBooks: () => {
        const state = get();
        return state.bookmarkedBooks;
      },
    }),
    {
      name: 'bookmarks-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper hook
export const useBookmarks = () => {
  const {
    bookmarkedBooks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    clearAllBookmarks,
    getBookmarkCount,
  } = useBookmarksStore();

  return {
    bookmarkedBooks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    clearAllBookmarks,
    getBookmarkCount,
  };
};
