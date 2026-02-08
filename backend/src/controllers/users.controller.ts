import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { query } from "../db.js";
import { createUserSchema, updateUserSchema } from "../models/schemas.js";
import { writeAuditLog } from "../services/audit.service.js";
import { fail, ok } from "../utils/http.js";

export async function listUsers(req: Request, res: Response) {
  const rows = await query(
    `SELECT id, tenant_id, email, role, first_name, last_name, department, created_at
     FROM users WHERE tenant_id = $1 ORDER BY created_at DESC`,
    [req.tenantId]
  );
  return ok(res, rows);
}

export async function createUser(req: Request, res: Response) {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid request", parsed.error.flatten());

  const b = parsed.data;
  const existing = await query<{ id: string }>("SELECT id FROM users WHERE email = $1", [b.email]);
  if (existing.length) return fail(res, 409, "Email already exists");

  const hash = await bcrypt.hash(b.password, 10);
  const [user] = await query(
    `INSERT INTO users (tenant_id, email, password_hash, role, first_name, last_name, department)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING id, tenant_id, email, role, first_name, last_name, department, created_at`,
    [req.tenantId, b.email, hash, b.role, b.firstName, b.lastName, b.department ?? null]
  );

  await writeAuditLog({
    tenantId: req.tenantId as string,
    entityType: "user",
    entityId: user.id,
    action: "create",
    changedBy: req.auth!.sub,
    changes: user,
    ipAddress: req.ip
  });

  return ok(res, user, 201);
}

export async function getUser(req: Request, res: Response) {
  const rows = await query(
    `SELECT id, tenant_id, email, role, first_name, last_name, department, created_at
     FROM users WHERE tenant_id = $1 AND id = $2`,
    [req.tenantId, req.params.id]
  );
  if (!rows.length) return fail(res, 404, "User not found");
  return ok(res, rows[0]);
}

export async function updateUser(req: Request, res: Response) {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid request", parsed.error.flatten());

  const existing = await query("SELECT * FROM users WHERE tenant_id = $1 AND id = $2", [req.tenantId, req.params.id]);
  if (!existing.length) return fail(res, 404, "User not found");

  const entries = Object.entries(parsed.data);
  if (!entries.length) return ok(res, existing[0]);

  const setClauses = entries.map(([k], i) => `${toSnake(k)} = $${i + 1}`);
  const values = entries.map(([, v]) => v);
  values.push(req.tenantId as string, req.params.id);

  const [updated] = await query(
    `UPDATE users SET ${setClauses.join(", ")} WHERE tenant_id = $${entries.length + 1} AND id = $${entries.length + 2}
     RETURNING id, tenant_id, email, role, first_name, last_name, department, created_at`,
    values
  );

  await writeAuditLog({
    tenantId: req.tenantId as string,
    entityType: "user",
    entityId: req.params.id,
    action: "update",
    changedBy: req.auth!.sub,
    changes: { before: existing[0], after: updated },
    ipAddress: req.ip
  });

  return ok(res, updated);
}

function toSnake(value: string) {
  return value.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
}
