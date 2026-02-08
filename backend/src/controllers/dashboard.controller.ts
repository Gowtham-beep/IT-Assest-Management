import type { Request, Response } from "express";
import { query } from "../db.js";
import { ok } from "../utils/http.js";

export async function dashboardStats(req: Request, res: Response) {
  const [assets] = await query<{ total: number; available: number; assigned: number; in_repair: number }>(
    `SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'available')::int AS available,
      COUNT(*) FILTER (WHERE status = 'assigned')::int AS assigned,
      COUNT(*) FILTER (WHERE status = 'in_repair')::int AS in_repair
     FROM assets WHERE tenant_id = $1`,
    [req.tenantId]
  );

  const [requests] = await query<{ pending: number }>(
    `SELECT COUNT(*) FILTER (WHERE status = 'pending')::int AS pending
     FROM asset_requests WHERE tenant_id = $1`,
    [req.tenantId]
  );

  return ok(res, {
    totalAssets: assets?.total ?? 0,
    availableAssets: assets?.available ?? 0,
    assignedAssets: assets?.assigned ?? 0,
    inRepairAssets: assets?.in_repair ?? 0,
    pendingRequests: requests?.pending ?? 0
  });
}
