import { Hono } from "hono";
import { successResponse, errorResponse } from "../utils/response";
import type { Env } from "../types/env";
import { calculateReadingTime } from "../utils/helpers";

const bookDetails = new Hono<{ Bindings: Env }>();

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

bookDetails.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const googleApiKey = c.env?.GOOGLE_BOOKS_API_KEY;

    const url = `https://www.googleapis.com/books/v1/volumes/${id}${
      googleApiKey ? `?key=${googleApiKey}` : ""
    }`;

    const res = await fetch(url);
    if (!res.ok) {
      return errorResponse(c, `Failed to fetch details for book ID ${id}`, 500);
    }

    const data = await res.json();
    const info = data.volumeInfo;
    const readingTime = calculateReadingTime(info.pageCount);

    // Try to get recommendations
    let recommendations: BookResponse[] = [];
    if (info.categories?.length) {
      const recCategory = info.categories[0];
      const recUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(
        recCategory
      )}&maxResults=10${googleApiKey ? `&key=${googleApiKey}` : ""}`;

      const recRes = await fetch(recUrl);
      if (recRes.ok) {
        const recData = await recRes.json();
        recommendations = (recData.items || [])
          .filter((item: any) => item.id !== id) // avoid self
          .map((item: any) => {
            const vi = item.volumeInfo;
            return {
              id: item.id,
              title: vi.title,
              coverImage:
                vi.imageLinks?.thumbnail || vi.imageLinks?.smallThumbnail || "",
              authorName: vi.authors?.join(", ") || "Unknown",
              readingTime: calculateReadingTime(vi.pageCount),
              rank: 0,
              weeksOnList: 0,
              description: vi.description?.slice(0, 300),
              pageCount: vi.pageCount,
              categories: vi.categories,
              publishedDate: vi.publishedDate,
            };
          })
          .slice(0, 5); // Limit to 5 recommendations
      }
    }

    return successResponse(
      c,
      {
        id,
        title: info.title,
        authors: info.authors || [],
        highResCover:
          info.imageLinks?.extraLarge ||
          info.imageLinks?.large ||
          info.imageLinks?.thumbnail ||
          info.imageLinks?.smallThumbnail ||
          "",
        description: info.description,
        categories: info.categories || [],
        readingTime,
        pageCount: info.pageCount,
        publishedDate: info.publishedDate,
        publisher: info.publisher,
        volumeInfo: {
          volume: info.volume,
          series: info.seriesInfo?.bookDisplayNumber,
        },
        aboutAuthor: info?.authors?.[0]
          ? `Information about ${info.authors[0]} is not available from Google Books API.`
          : undefined,
        recommendations,
      },
      "Book details fetched successfully"
    );
  } catch (err) {
    console.error("Error fetching book details:", err);
    return errorResponse(c, "Failed to fetch book details", 500);
  }
});

export default bookDetails;
