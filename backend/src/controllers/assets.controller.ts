import type { Request, Response } from "express";
import { query } from "../db.js";
import { assignAssetSchema, createAssetSchema, updateAssetSchema } from "../models/schemas.js";
import { writeAuditLog } from "../services/audit.service.js";
import { fail, ok } from "../utils/http.js";

export async function listAssets(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { status, type } = req.query;

  const filters: string[] = ["tenant_id = $1"];
  const params: unknown[] = [tenantId];

  if (status) {
    params.push(status);
    filters.push(`status = $${params.length}`);
  }

  if (type) {
    params.push(type);
    filters.push(`asset_type = $${params.length}`);
  }

  const assets = await query(
    `SELECT * FROM assets WHERE ${filters.join(" AND ")} ORDER BY created_at DESC`,
    params
  );

  return ok(res, assets);
}

export async function getAsset(req: Request, res: Response) {
  const rows = await query(
    "SELECT * FROM assets WHERE id = $1 AND tenant_id = $2",
    [req.params.id, req.tenantId]
  );
  if (!rows.length) return fail(res, 404, "Asset not found");
  return ok(res, rows[0]);
}

export async function createAsset(req: Request, res: Response) {
  const parsed = createAssetSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid request", parsed.error.flatten());

  const b = parsed.data;
  const rows = await query(
    `INSERT INTO assets (tenant_id, asset_type, brand, model, serial_number, purchase_date, purchase_price, warranty_expiry, status, location, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [
      req.tenantId,
      b.assetType,
      b.brand,
      b.model,
      b.serialNumber,
      b.purchaseDate ?? null,
      b.purchasePrice ?? null,
      b.warrantyExpiry ?? null,
      b.status,
      b.location ?? null,
      b.notes ?? null
    ]
  );

  await writeAuditLog({
    tenantId: req.tenantId as string,
    entityType: "asset",
    entityId: rows[0].id,
    action: "create",
    changedBy: req.auth!.sub,
    changes: rows[0],
    ipAddress: req.ip
  });

  return ok(res, rows[0], 201);
}

export async function updateAsset(req: Request, res: Response) {
  const parsed = updateAssetSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid request", parsed.error.flatten());

  const before = await query("SELECT * FROM assets WHERE id = $1 AND tenant_id = $2", [req.params.id, req.tenantId]);
  if (!before.length) return fail(res, 404, "Asset not found");

  const entries = Object.entries(parsed.data);
  if (!entries.length) return ok(res, before[0]);

  const setClauses = entries.map(([k], i) => `${toSnake(k)} = $${i + 1}`);
  const values = entries.map(([, v]) => v);
  values.push(req.params.id, req.tenantId as string);

  const updated = await query(
    `UPDATE assets SET ${setClauses.join(", ")}, updated_at = now() WHERE id = $${entries.length + 1} AND tenant_id = $${entries.length + 2} RETURNING *`,
    values
  );

  await writeAuditLog({
    tenantId: req.tenantId as string,
    entityType: "asset",
    entityId: req.params.id,
    action: "update",
    changedBy: req.auth!.sub,
    changes: { before: before[0], after: updated[0] },
    ipAddress: req.ip
  });

  return ok(res, updated[0]);
}

export async function retireAsset(req: Request, res: Response) {
  const rows = await query(
    "UPDATE assets SET status = 'retired', updated_at = now() WHERE id = $1 AND tenant_id = $2 RETURNING *",
    [req.params.id, req.tenantId]
  );

  if (!rows.length) return fail(res, 404, "Asset not found");

  await writeAuditLog({
    tenantId: req.tenantId as string,
    entityType: "asset",
    entityId: req.params.id,
    action: "retire",
    changedBy: req.auth!.sub,
    changes: { status: "retired" },
    ipAddress: req.ip
  });

  return ok(res, rows[0]);
}

export async function searchAssets(req: Request, res: Response) {
  const q = String(req.query.q ?? "").trim();
  if (!q) return ok(res, []);

  const rows = await query(
    `SELECT a.*, u.first_name, u.last_name,
      ts_rank(a.search_vector, plainto_tsquery('simple', $2)) as rank
     FROM assets a
     LEFT JOIN asset_assignments aa
       ON aa.asset_id = a.id AND aa.tenant_id = a.tenant_id AND aa.returned_date IS NULL
     LEFT JOIN users u ON u.id = aa.user_id AND u.tenant_id = a.tenant_id
     WHERE a.tenant_id = $1
       AND (a.search_vector @@ plainto_tsquery('simple', $2)
         OR to_tsvector('simple', coalesce(u.first_name,'') || ' ' || coalesce(u.last_name,'')) @@ plainto_tsquery('simple', $2))
     ORDER BY rank DESC, a.created_at DESC
     LIMIT 50`,
    [req.tenantId, q]
  );

  return ok(res, rows);
}

export async function assignAsset(req: Request, res: Response) {
  const parsed = assignAssetSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid request", parsed.error.flatten());

  const { userId, expectedReturnDate, conditionNotes } = parsed.data;
  const [asset] = await query<{ id: string; status: string }>(
    "SELECT id, status FROM assets WHERE id = $1 AND tenant_id = $2",
    [req.params.id, req.tenantId]
  );

  if (!asset) return fail(res, 404, "Asset not found");
  if (asset.status === "assigned") return fail(res, 409, "Asset already assigned");

  const [assignment] = await query(
    `INSERT INTO asset_assignments (tenant_id, asset_id, user_id, expected_return_date, condition_notes, created_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [req.tenantId, req.params.id, userId, expectedReturnDate ?? null, conditionNotes ?? null, req.auth!.sub]
  );

  await query("UPDATE assets SET status = 'assigned', updated_at = now() WHERE id = $1 AND tenant_id = $2", [
    req.params.id,
    req.tenantId
  ]);

  await writeAuditLog({
    tenantId: req.tenantId as string,
    entityType: "asset_assignment",
    entityId: assignment.id,
    action: "assign",
    changedBy: req.auth!.sub,
    changes: assignment,
    ipAddress: req.ip
  });

  return ok(res, assignment, 201);
}

export async function returnAsset(req: Request, res: Response) {
  const [assignment] = await query(
    `UPDATE asset_assignments
     SET returned_date = now()
     WHERE asset_id = $1 AND tenant_id = $2 AND returned_date IS NULL
     RETURNING *`,
    [req.params.id, req.tenantId]
  );

  if (!assignment) return fail(res, 404, "Active assignment not found");

  await query("UPDATE assets SET status = 'available', updated_at = now() WHERE id = $1 AND tenant_id = $2", [
    req.params.id,
    req.tenantId
  ]);

  await writeAuditLog({
    tenantId: req.tenantId as string,
    entityType: "asset_assignment",
    entityId: assignment.id,
    action: "return",
    changedBy: req.auth!.sub,
    changes: assignment,
    ipAddress: req.ip
  });

  return ok(res, assignment);
}

function toSnake(value: string) {
  return value.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
}
