import { query } from "../db.js";

export async function whoHasWhat(tenantId: string) {
  return query(
    `SELECT
      a.id as asset_id,
      a.asset_type,
      a.brand,
      a.model,
      a.serial_number,
      a.status,
      u.id as user_id,
      u.first_name,
      u.last_name,
      u.email
     FROM assets a
     LEFT JOIN asset_assignments aa
       ON aa.asset_id = a.id AND aa.tenant_id = a.tenant_id AND aa.returned_date IS NULL
     LEFT JOIN users u ON u.id = aa.user_id AND u.tenant_id = aa.tenant_id
     WHERE a.tenant_id = $1
     ORDER BY a.created_at DESC`,
    [tenantId]
  );
}
