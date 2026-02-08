import type { Request, Response } from "express";
import { query } from "../db.js";
import { createRequestSchema } from "../models/schemas.js";
import { writeAuditLog } from "../services/audit.service.js";
import { fail, ok } from "../utils/http.js";

export async function listRequests(req: Request, res: Response) {
  const rows = await query(
    `SELECT * FROM asset_requests
     WHERE tenant_id = $1
     ORDER BY created_at DESC`,
    [req.tenantId]
  );
  return ok(res, rows);
}

export async function createRequest(req: Request, res: Response) {
  const parsed = createRequestSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid request", parsed.error.flatten());

  const b = parsed.data;
  const [created] = await query(
    `INSERT INTO asset_requests (tenant_id, requested_by, requested_for, asset_type, justification, status)
     VALUES ($1, $2, $3, $4, $5, 'pending')
     RETURNING *`,
    [req.tenantId, req.auth!.sub, b.requestedFor, b.assetType, b.justification]
  );

  await writeAuditLog({
    tenantId: req.tenantId as string,
    entityType: "asset_request",
    entityId: created.id,
    action: "create",
    changedBy: req.auth!.sub,
    changes: created,
    ipAddress: req.ip
  });

  return ok(res, created, 201);
}

export async function approveRequest(req: Request, res: Response) {
  return transition(req, res, "approved");
}

export async function rejectRequest(req: Request, res: Response) {
  return transition(req, res, "rejected");
}

export async function fulfillRequest(req: Request, res: Response) {
  return transition(req, res, "fulfilled");
}

async function transition(req: Request, res: Response, status: "approved" | "rejected" | "fulfilled") {
  const [updated] = await query(
    `UPDATE asset_requests
     SET status = $1,
         approved_by = CASE WHEN $1 IN ('approved','rejected') THEN $2 ELSE approved_by END,
         approved_at = CASE WHEN $1 IN ('approved','rejected') THEN now() ELSE approved_at END,
         fulfilled_at = CASE WHEN $1 = 'fulfilled' THEN now() ELSE fulfilled_at END
     WHERE id = $3 AND tenant_id = $4
     RETURNING *`,
    [status, req.auth!.sub, req.params.id, req.tenantId]
  );

  if (!updated) return fail(res, 404, "Request not found");

  await writeAuditLog({
    tenantId: req.tenantId as string,
    entityType: "asset_request",
    entityId: updated.id,
    action: status,
    changedBy: req.auth!.sub,
    changes: updated,
    ipAddress: req.ip
  });

  return ok(res, updated);
}
