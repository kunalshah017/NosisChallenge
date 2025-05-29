import { Hono } from "hono";
import { corsMiddleware } from "./middleware/cors";
import routes from "./routes";
import { errorResponse } from "./utils/response";
import type { Env } from "./types/env";

const app = new Hono<{ Bindings: Env }>();

app.use("*", corsMiddleware);

app.route("/", routes);

app.get("/", (c) => {
  return c.json({
    message: "NosisChallenge API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      version: "/api/version",
      topBooks: ["/top-books/week", "/top-books/month", "/top-books/random"],
      bookDetails: "/details/:id",
      category: "/category/:category",
    },
  });
});

app.notFound((c) => {
  return errorResponse(c, "Endpoint not found", 404);
});

app.onError((err, c) => {
  console.error("Server error:", err);
  return errorResponse(c, "Internal server error", 500);
});

export default app;
