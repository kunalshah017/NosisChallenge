import { Hono } from "hono";
import { successResponse, errorResponse } from "../utils/response";
import type { Env } from "../types/env";
import { calculateReadingTime, convertToHttps } from "../utils/helpers";

const category = new Hono<{ Bindings: Env }>();

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

category.get("/:category", async (c) => {
  const category = c.req.param("category");
  const googleApiKey = c.env?.GOOGLE_BOOKS_API_KEY;

  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(
      category
    )}&maxResults=20${googleApiKey ? `&key=${googleApiKey}` : ""}`;

    const res = await fetch(url);
    if (!res.ok) {
      return errorResponse(
        c,
        `Failed to fetch books for category ${category}`,
        500
      );
    }

    const data = await res.json();
    if (!data.items || data.items.length === 0) {
      return errorResponse(c, `No books found for category ${category}`, 404);
    }

    const books: BookResponse[] = data.items.map((item: any) => {
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

    return successResponse(c, books, `Books for category: ${category}`);
  } catch (err) {
    console.error("Error fetching books by category:", err);
    return errorResponse(c, "Failed to fetch category books", 500);
  }
});

export default category;
