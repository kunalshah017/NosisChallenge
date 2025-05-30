import { Hono } from "hono";
import { successResponse, errorResponse } from "../utils/response";
import type { Env } from "../types/env";
import { calculateReadingTime, convertToHttps } from "../utils/helpers";

const topBooks = new Hono<{ Bindings: Env }>();

interface NYTBook {
  title: string;
  author: string;
  rank: number;
  weeks_on_list: number;
}

interface GoogleBookInfo {
  id?: string;
  title: string;
  authors?: string[];
  description?: string;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  pageCount?: number;
  categories?: string[];
  publishedDate?: string;
}

interface BookResponse {
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

const fetchTrendingBooks = async (nytApiKey: string): Promise<NYTBook[]> => {
  const nytUrl = `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${nytApiKey}`;

  const response = await fetch(nytUrl);

  if (!response.ok) {
    throw new Error(`NYT API error: ${response.status}`);
  }

  const data = await response.json();

  return data.results.books.map((book: any) => ({
    title: book.title,
    author: book.author,
    rank: book.rank,
    weeks_on_list: book.weeks_on_list || 0,
  }));
};

const fetchBookDetailsFromGoogle = async (
  title: string,
  author: string,
  googleApiKey?: string
): Promise<GoogleBookInfo | null> => {
  const query = `${title} ${author}`;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
  )}&maxResults=1${googleApiKey ? `&key=${googleApiKey}` : ""}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.warn(`Google Books API error for "${title}": ${response.status}`);
      return null;
    }

    const data = await response.json();
    const item = data.items?.[0];
    if (!item) return null;

    return {
      id: item.id,
      ...item.volumeInfo,
    };
  } catch (error) {
    console.warn(`Failed to fetch Google Books data for "${title}":`, error);
    return null;
  }
};

const fetchBooksFromDate = async (
  nytApiKey: string,
  listName: string,
  date: string
): Promise<NYTBook[]> => {
  const url = `https://api.nytimes.com/svc/books/v3/lists/${date}/${listName}.json?api-key=${nytApiKey}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch NYT list for ${date}`);
  }

  const data = await res.json();
  return data.results.books.map((book: any) => ({
    title: book.title,
    author: book.author,
    rank: book.rank,
    weeks_on_list: book.weeks_on_list || 0,
  }));
};

/// --------------------------------------------------------
// Route handlers for top books
// --------------------------------------------------------

topBooks.get("/week", async (c) => {
  try {
    const nytApiKey = c.env?.NYT_API_KEY;
    const googleApiKey = c.env?.GOOGLE_BOOKS_API_KEY;

    if (!nytApiKey) {
      return errorResponse(c, "NYT API key not configured", 500);
    }

    // Fetch trending books from NYT
    const trendingBooks = await fetchTrendingBooks(nytApiKey);

    // Enrich with Google Books data
    const enrichedBooks: BookResponse[] = [];

    for (const book of trendingBooks) {
      const googleDetails = await fetchBookDetailsFromGoogle(
        book.title,
        book.author,
        googleApiKey
      );

      const enrichedBook: BookResponse = {
        id: googleDetails?.id || "",
        title: googleDetails?.title || book.title,
        coverImage: convertToHttps(
          googleDetails?.imageLinks?.thumbnail ||
            googleDetails?.imageLinks?.smallThumbnail
        ),
        authorName: googleDetails?.authors?.join(", ") || book.author,
        readingTime: calculateReadingTime(googleDetails?.pageCount),
        rank: book.rank,
        weeksOnList: book.weeks_on_list,
        description: googleDetails?.description?.slice(0, 300),
        pageCount: googleDetails?.pageCount,
        categories: googleDetails?.categories,
        publishedDate: googleDetails?.publishedDate,
      };

      enrichedBooks.push(enrichedBook);
    }

    return successResponse(
      c,
      {
        books: enrichedBooks,
        totalBooks: enrichedBooks.length,
        source: "NYT Hardcover Fiction Bestsellers",
        lastUpdated: new Date().toISOString(),
      },
      "Top books fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching top books:", error);
    return errorResponse(c, "Failed to fetch top books", 500);
  }
});

topBooks.get("/month", async (c) => {
  try {
    const nytApiKey = c.env?.NYT_API_KEY;
    const googleApiKey = c.env?.GOOGLE_BOOKS_API_KEY;

    if (!nytApiKey) {
      return errorResponse(c, "NYT API key not configured", 500);
    }

    const today = new Date();
    const listName = "hardcover-fiction";

    // Fetch last 4 weeks of lists (Sundays)
    const dates: string[] = [];
    for (let i = 0; i < 4; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i * 7);
      const iso = date.toISOString().split("T")[0];
      dates.push(iso);
    }

    // Fetch all books from these weeks and count appearances
    const bookMap: Record<string, { data: NYTBook; appearances: number }> = {};

    for (const date of dates) {
      const books = await fetchBooksFromDate(nytApiKey, listName, date);

      for (const book of books) {
        const key = `${book.title.toLowerCase()}-${book.author.toLowerCase()}`;
        if (!bookMap[key]) {
          bookMap[key] = { data: book, appearances: 0 };
        }
        bookMap[key].appearances += 1;
      }
    }

    const sortedBooks = Object.values(bookMap)
      .sort((a, b) => b.appearances - a.appearances)
      .slice(0, 10); // Top 10 for month

    // Enrich with Google Books data
    const enrichedBooks: BookResponse[] = [];

    for (const { data: book, appearances } of sortedBooks) {
      const googleDetails = await fetchBookDetailsFromGoogle(
        book.title,
        book.author,
        googleApiKey
      );

      const enrichedBook: BookResponse = {
        id: googleDetails?.id || "",
        title: googleDetails?.title || book.title,
        coverImage: convertToHttps(
          googleDetails?.imageLinks?.thumbnail ||
            googleDetails?.imageLinks?.smallThumbnail
        ),
        authorName: googleDetails?.authors?.join(", ") || book.author,
        readingTime: calculateReadingTime(googleDetails?.pageCount),
        rank: book.rank,
        weeksOnList: book.weeks_on_list,
        description: googleDetails?.description?.slice(0, 300),
        pageCount: googleDetails?.pageCount,
        categories: googleDetails?.categories,
        publishedDate: googleDetails?.publishedDate,
      };

      enrichedBooks.push(enrichedBook);
    }

    return successResponse(
      c,
      {
        books: enrichedBooks,
        totalBooks: enrichedBooks.length,
        source: "NYT Hardcover Fiction (Monthly Aggregate)",
        lastUpdated: new Date().toISOString(),
      },
      "Top books for the month fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching top books of the month:", error);
    return errorResponse(c, "Failed to fetch monthly top books", 500);
  }
});

topBooks.get("/random", async (c) => {
  try {
    const googleApiKey = c.env?.GOOGLE_BOOKS_API_KEY;

    const subjects = [
      "fiction",
      "mystery",
      "fantasy",
      "science",
      "history",
      "romance",
      "technology",
      "philosophy",
      "self-help",
      "thriller",
    ];

    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const randomStartIndex = Math.floor(Math.random() * 100); // Google allows up to 1000

    const queryUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:${randomSubject}&startIndex=${randomStartIndex}&maxResults=20${
      googleApiKey ? `&key=${googleApiKey}` : ""
    }`;

    const response = await fetch(queryUrl);

    if (!response.ok) {
      return errorResponse(
        c,
        `Google Books API error: ${response.status}`,
        500
      );
    }

    const data = await response.json();

    const books: BookResponse[] = (data.items || []).map((item: any) => {
      const info = item.volumeInfo;
      return {
        id: item.id,
        title: info.title,
        coverImage: convertToHttps(
          info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail
        ),
        authorName: info.authors?.join(", ") || "Unknown",
        readingTime: calculateReadingTime(info.pageCount),
        rank: 0,
        weeksOnList: 0,
        description: info.description?.slice(0, 300),
        pageCount: info.pageCount,
        categories: info.categories,
        publishedDate: info.publishedDate,
      };
    });

    return successResponse(
      c,
      {
        books,
        totalBooks: books.length,
        subjectQueried: randomSubject,
        source: "Google Books API",
        lastUpdated: new Date().toISOString(),
      },
      "Random books fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching random books:", error);
    return errorResponse(c, "Failed to fetch random books", 500);
  }
});

export default topBooks;
