import type { NextFunction, Request, Response } from "express";
import { fail } from "../utils/http.js";

export function requireTenant(req: Request, res: Response, next: NextFunction) {
  const tenantId = req.tenantId;
  if (!tenantId) return fail(res, 401, "Tenant context missing");
  return next();
}

export function tenantFromSubdomain(req: Request, _res: Response, next: NextFunction) {
  const host = req.headers.host ?? "";
  const parts = host.split(".");
  if (parts.length > 2) req.headers["x-tenant-subdomain"] = parts[0];
  next();
}
