import type { NextFunction, Request, Response } from "express";
import { fail } from "../utils/http.js";
import { verifyAccessToken } from "../utils/jwt.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return fail(res, 401, "Unauthorized");

  try {
    const token = authHeader.replace("Bearer ", "");
    const payload = verifyAccessToken(token);
    req.auth = payload;
    req.tenantId = payload.tenantId;
    return next();
  } catch {
    return fail(res, 401, "Invalid token");
  }
}

export function requireRole(...roles: Array<"admin" | "it_staff" | "manager" | "employee">) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) return fail(res, 401, "Unauthorized");
    if (!roles.includes(req.auth.role)) return fail(res, 403, "Forbidden");
    return next();
  };
}
