import { useQuery } from '@tanstack/react-query';
import { Book, BookDetails, ApiResponse } from '~/types/api';
import { queryConfig } from './useQueryConfig';

// Base API URL - update this with your actual API URL
const API_BASE_URL = 'https://nosischallenge-server.kunalmanishshah.workers.dev';

// API functions
const api = {
  async fetchTopBooks(
    period: 'week' | 'month' | 'random'
  ): Promise<ApiResponse<{ books: Book[] }>> {
    const response = await fetch(`${API_BASE_URL}/top-books/${period}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch top books: ${response.statusText}`);
    }
    return response.json();
  },

  async fetchBookDetails(id: string): Promise<ApiResponse<BookDetails>> {
    const response = await fetch(`${API_BASE_URL}/details/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch book details: ${response.statusText}`);
    }
    return response.json();
  },

  async fetchBooksByCategory(category: string): Promise<ApiResponse<Book[]>> {
    const response = await fetch(`${API_BASE_URL}/category/${category}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch books by category: ${response.statusText}`);
    }
    return response.json();
  },

  async checkHealth(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    return response.json();
  },
};

// Query Keys
export const queryKeys = {
  books: ['books'] as const,
  topBooks: (period: string) => [...queryKeys.books, 'top', period] as const,
  bookDetails: (id: string) => [...queryKeys.books, 'details', id] as const,
  booksByCategory: (category: string) => [...queryKeys.books, 'category', category] as const,
  health: ['health'] as const,
};

// Custom hooks
export const useTopBooks = (
  period: 'week' | 'month' | 'random',
  options?: {
    enabled?: boolean;
  }
) => {
  const config = queryConfig[period];

  return useQuery({
    queryKey: queryKeys.topBooks(period),
    queryFn: () => api.fetchTopBooks(period),
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    enabled: options?.enabled ?? true,
    select: (data) => data.data?.books ?? [],
  });
};

export const useBookDetails = (
  id: string,
  options?: {
    enabled?: boolean;
  }
) => {
  const config = queryConfig.bookDetails;

  return useQuery({
    queryKey: queryKeys.bookDetails(id),
    queryFn: () => api.fetchBookDetails(id),
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    enabled: (options?.enabled ?? true) && !!id,
    select: (data) => data.data,
  });
};

export const useBooksByCategory = (
  category: string,
  options?: {
    enabled?: boolean;
  }
) => {
  const config = queryConfig.booksByCategory;

  return useQuery({
    queryKey: queryKeys.booksByCategory(category),
    queryFn: () => api.fetchBooksByCategory(category),
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    enabled: (options?.enabled ?? true) && !!category,
    select: (data) => data.data ?? [],
  });
};

export const useHealthCheck = () => {
  const config = queryConfig.realtime;

  return useQuery({
    queryKey: queryKeys.health,
    queryFn: api.checkHealth,
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    retry: 3,
    select: (data) => data.data,
  });
};

export { api };
