import type { Request, Response } from "express";
import { query } from "../db.js";
import { ok } from "../utils/http.js";

export async function inventoryReport(req: Request, res: Response) {
  const rows = await query(
    `SELECT asset_type, status, COUNT(*)::int as count
     FROM assets WHERE tenant_id = $1 GROUP BY asset_type, status ORDER BY asset_type, status`,
    [req.tenantId]
  );
  return ok(res, rows);
}

export async function assignmentsReport(req: Request, res: Response) {
  const rows = await query(
    `SELECT aa.*, a.asset_type, a.brand, a.model, u.first_name, u.last_name
     FROM asset_assignments aa
     JOIN assets a ON a.id = aa.asset_id AND a.tenant_id = aa.tenant_id
     JOIN users u ON u.id = aa.user_id AND u.tenant_id = aa.tenant_id
     WHERE aa.tenant_id = $1
     ORDER BY aa.assigned_date DESC`,
    [req.tenantId]
  );
  return ok(res, rows);
}

export async function auditReport(req: Request, res: Response) {
  const rows = await query(
    `SELECT * FROM audit_logs WHERE tenant_id = $1 ORDER BY timestamp DESC LIMIT 1000`,
    [req.tenantId]
  );
  return ok(res, rows);
}
