export const calculateReadingTime = (pageCount?: number): string => {
  if (!pageCount) return "Unknown";

  // Average reading speed: 250 words per minute
  // Average words per page: 250-300, we'll use 275
  const wordsPerPage = 275;
  const wordsPerMinute = 250;

  const totalWords = pageCount * wordsPerPage;
  const totalMinutes = totalWords / wordsPerMinute;

  if (totalMinutes < 60) {
    return `${Math.round(totalMinutes)} minutes`;
  } else {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
};

// ...existing code...

export const convertToHttps = (url: string | undefined): string => {
  if (!url) return "";
  return url.replace(/^http:\/\//, "https://");
};
