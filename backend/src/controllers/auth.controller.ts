import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { query } from "../db.js";
import { loginSchema, registerTenantSchema } from "../models/schemas.js";
import { writeAuditLog } from "../services/audit.service.js";
import { fail, ok } from "../utils/http.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

export async function register(req: Request, res: Response) {
  const parsed = registerTenantSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid request", parsed.error.flatten());

  const { companyName, subdomain, email, password, firstName, lastName } = parsed.data;
  const existingTenant = await query<{ id: string }>("SELECT id FROM tenants WHERE subdomain = $1", [subdomain]);
  if (existingTenant.length) return fail(res, 409, "Subdomain already exists");

  const existingUser = await query<{ id: string }>("SELECT id FROM users WHERE email = $1", [email]);
  if (existingUser.length) return fail(res, 409, "Email already exists");

  const [tenant] = await query<{ id: string }>(
    "INSERT INTO tenants (name, subdomain, plan_type, settings) VALUES ($1, $2, 'starter', '{}'::jsonb) RETURNING id",
    [companyName, subdomain]
  );

  const hash = await bcrypt.hash(password, 10);
  const [user] = await query<{ id: string; role: "admin"; email: string }>(
    `INSERT INTO users (tenant_id, email, password_hash, role, first_name, last_name)
     VALUES ($1, $2, $3, 'admin', $4, $5)
     RETURNING id, role, email`,
    [tenant.id, email, hash, firstName, lastName]
  );

  await writeAuditLog({
    tenantId: tenant.id,
    entityType: "user",
    entityId: user.id,
    action: "create_admin",
    changedBy: user.id,
    changes: { email, role: "admin" },
    ipAddress: req.ip
  });

  const payload = { sub: user.id, tenantId: tenant.id, role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return ok(res, { accessToken, refreshToken, tenantId: tenant.id, userId: user.id }, 201);
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid request", parsed.error.flatten());

  const { email, password } = parsed.data;
  const [user] = await query<{
    id: string;
    tenant_id: string;
    email: string;
    password_hash: string;
    role: "admin" | "it_staff" | "manager" | "employee";
  }>("SELECT id, tenant_id, email, password_hash, role FROM users WHERE email = $1", [email]);

  if (!user) return fail(res, 404, "User does not exist");
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return fail(res, 401, "Invalid password");

  const payload = { sub: user.id, tenantId: user.tenant_id, role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return ok(res, { accessToken, refreshToken, tenantId: user.tenant_id, userId: user.id });
}

export async function refresh(req: Request, res: Response) {
  const refreshToken = req.body?.refreshToken;
  if (!refreshToken) return fail(res, 400, "Refresh token required");

  try {
    const payload = verifyRefreshToken(refreshToken);
    const accessToken = signAccessToken(payload);
    return ok(res, { accessToken });
  } catch {
    return fail(res, 401, "Invalid refresh token");
  }
}
