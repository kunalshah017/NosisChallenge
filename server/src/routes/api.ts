import { Hono } from "hono";
import { successResponse } from "../utils/response";

const api = new Hono();

api.get("/health", (c) => {
  return successResponse(c, {
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

api.get("/version", (c) => {
  return successResponse(c, { version: "1.0.0" });
});

export default api;
