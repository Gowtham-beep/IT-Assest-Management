import type { Response } from "express";

export function ok<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({ data });
}

export function fail(res: Response, status: number, message: string, details?: unknown) {
  return res.status(status).json({ error: { message, details } });
}
