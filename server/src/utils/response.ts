import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import type { ApiResponse } from "../types/api";

export const successResponse = <T>(
  c: Context,
  data: T,
  message?: string,
  status: StatusCode = 200
) => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return c.json(response, status as any);
};

export const errorResponse = (
  c: Context,
  error: string,
  status: StatusCode = 400
) => {
  const response: ApiResponse = {
    success: false,
    error,
  };
  return c.json(response, status as any);
};
