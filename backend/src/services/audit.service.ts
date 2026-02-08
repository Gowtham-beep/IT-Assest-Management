import { query } from "../db.js";

type AuditInput = {
  tenantId: string;
  entityType: string;
  entityId: string;
  action: string;
  changedBy: string;
  changes: unknown;
  ipAddress?: string;
};

export async function writeAuditLog(input: AuditInput) {
  await query(
    `INSERT INTO audit_logs (tenant_id, entity_type, entity_id, action, changed_by, changes, ip_address)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7)`,
    [
      input.tenantId,
      input.entityType,
      input.entityId,
      input.action,
      input.changedBy,
      JSON.stringify(input.changes ?? {}),
      input.ipAddress ?? null
    ]
  );
}
