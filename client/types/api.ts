// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Book {
  id: string;
  title: string;
  coverImage: string;
  authorName: string;
  readingTime: string;
  rank: number;
  weeksOnList: number;
  description?: string;
  pageCount?: number;
  categories?: string[];
  publishedDate?: string;
}

export interface BookDetails extends Book {
  authors: string[];
  highResCover: string;
  publisher?: string;
  volumeInfo?: {
    volume?: string;
    series?: string;
  };
  aboutAuthor?: string;
  recommendations?: Book[];
}
