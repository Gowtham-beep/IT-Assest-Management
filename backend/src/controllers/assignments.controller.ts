import type { Request, Response } from "express";
import { query } from "../db.js";
import { ok } from "../utils/http.js";

export async function listAssignments(req: Request, res: Response) {
  const rows = await query(
    `SELECT aa.*, a.asset_type, a.brand, a.model, a.serial_number, u.first_name, u.last_name, u.email
     FROM asset_assignments aa
     JOIN assets a ON a.id = aa.asset_id AND a.tenant_id = aa.tenant_id
     JOIN users u ON u.id = aa.user_id AND u.tenant_id = aa.tenant_id
     WHERE aa.tenant_id = $1
     ORDER BY aa.assigned_date DESC`,
    [req.tenantId]
  );
  return ok(res, rows);
}

export async function listAssetsByUser(req: Request, res: Response) {
  const rows = await query(
    `SELECT aa.*, a.asset_type, a.brand, a.model, a.serial_number
     FROM asset_assignments aa
     JOIN assets a ON a.id = aa.asset_id AND a.tenant_id = aa.tenant_id
     WHERE aa.tenant_id = $1 AND aa.user_id = $2
     ORDER BY aa.assigned_date DESC`,
    [req.tenantId, req.params.id]
  );
  return ok(res, rows);
}
