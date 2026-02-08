-- Seed realistic fake data for all tenants.
-- Safe to run multiple times (idempotent by tenant-scoped unique keys and guards).

-- Known bcrypt hash for password: password123
-- Use this for all seeded users.
WITH seed_hash AS (
  SELECT '$2a$10$1RQzEJfPo0f0me4RXTmQYOEU8Of81faIagfNWMf1Q6.9JVVJv6xQi'::text AS hash
)
INSERT INTO users (tenant_id, email, password_hash, role, first_name, last_name, department)
SELECT t.id, t.subdomain || '.it1@example.com', h.hash, 'it_staff', 'Iris', 'Tran', 'IT'
FROM tenants t, seed_hash h
WHERE NOT EXISTS (
  SELECT 1 FROM users u WHERE u.tenant_id = t.id AND u.email = t.subdomain || '.it1@example.com'
);

WITH seed_hash AS (
  SELECT '$2a$10$1RQzEJfPo0f0me4RXTmQYOEU8Of81faIagfNWMf1Q6.9JVVJv6xQi'::text AS hash
)
INSERT INTO users (tenant_id, email, password_hash, role, first_name, last_name, department)
SELECT t.id, t.subdomain || '.mgr1@example.com', h.hash, 'manager', 'Morgan', 'Lee', 'Operations'
FROM tenants t, seed_hash h
WHERE NOT EXISTS (
  SELECT 1 FROM users u WHERE u.tenant_id = t.id AND u.email = t.subdomain || '.mgr1@example.com'
);

WITH seed_hash AS (
  SELECT '$2a$10$1RQzEJfPo0f0me4RXTmQYOEU8Of81faIagfNWMf1Q6.9JVVJv6xQi'::text AS hash
)
INSERT INTO users (tenant_id, email, password_hash, role, first_name, last_name, department)
SELECT t.id, t.subdomain || '.emp1@example.com', h.hash, 'employee', 'Avery', 'Patel', 'Engineering'
FROM tenants t, seed_hash h
WHERE NOT EXISTS (
  SELECT 1 FROM users u WHERE u.tenant_id = t.id AND u.email = t.subdomain || '.emp1@example.com'
);

WITH seed_hash AS (
  SELECT '$2a$10$1RQzEJfPo0f0me4RXTmQYOEU8Of81faIagfNWMf1Q6.9JVVJv6xQi'::text AS hash
)
INSERT INTO users (tenant_id, email, password_hash, role, first_name, last_name, department)
SELECT t.id, t.subdomain || '.emp2@example.com', h.hash, 'employee', 'Jordan', 'Nguyen', 'Sales'
FROM tenants t, seed_hash h
WHERE NOT EXISTS (
  SELECT 1 FROM users u WHERE u.tenant_id = t.id AND u.email = t.subdomain || '.emp2@example.com'
);

WITH seed_hash AS (
  SELECT '$2a$10$1RQzEJfPo0f0me4RXTmQYOEU8Of81faIagfNWMf1Q6.9JVVJv6xQi'::text AS hash
)
INSERT INTO users (tenant_id, email, password_hash, role, first_name, last_name, department)
SELECT t.id, t.subdomain || '.emp3@example.com', h.hash, 'employee', 'Riley', 'Garcia', 'Finance'
FROM tenants t, seed_hash h
WHERE NOT EXISTS (
  SELECT 1 FROM users u WHERE u.tenant_id = t.id AND u.email = t.subdomain || '.emp3@example.com'
);

INSERT INTO assets (tenant_id, asset_type, brand, model, serial_number, purchase_date, purchase_price, warranty_expiry, status, location, notes)
SELECT
  t.id,
  CASE ((g.n - 1) % 4)
    WHEN 0 THEN 'laptop'
    WHEN 1 THEN 'monitor'
    WHEN 2 THEN 'dock'
    ELSE 'phone'
  END,
  CASE ((g.n - 1) % 5)
    WHEN 0 THEN 'Lenovo'
    WHEN 1 THEN 'Dell'
    WHEN 2 THEN 'HP'
    WHEN 3 THEN 'Apple'
    ELSE 'Samsung'
  END,
  CASE ((g.n - 1) % 5)
    WHEN 0 THEN 'ThinkPad T14'
    WHEN 1 THEN 'U2723QE'
    WHEN 2 THEN 'EliteBook 840'
    WHEN 3 THEN 'MacBook Air'
    ELSE 'Galaxy S24'
  END,
  upper(t.subdomain) || '-AST-' || lpad(g.n::text, 4, '0'),
  (current_date - ((g.n * 17) % 540) * interval '1 day')::date,
  (350 + (g.n * 37))::numeric(12,2),
  (current_date + ((g.n * 19) % 600) * interval '1 day')::date,
  CASE
    WHEN g.n % 11 = 0 THEN 'in_repair'
    WHEN g.n % 13 = 0 THEN 'retired'
    WHEN g.n % 3 = 0 THEN 'assigned'
    ELSE 'available'
  END,
  CASE WHEN g.n % 2 = 0 THEN 'HQ' ELSE 'Remote' END,
  'Seeded asset #' || g.n
FROM tenants t
CROSS JOIN generate_series(1, 24) AS g(n)
WHERE NOT EXISTS (
  SELECT 1
  FROM assets a
  WHERE a.tenant_id = t.id
    AND a.serial_number = upper(t.subdomain) || '-AST-' || lpad(g.n::text, 4, '0')
);

WITH assignees AS (
  SELECT
    u.tenant_id,
    u.id,
    row_number() OVER (PARTITION BY u.tenant_id ORDER BY u.created_at, u.id) AS rn
  FROM users u
  WHERE u.role IN ('employee', 'manager')
),
seed_targets AS (
  SELECT
    a.tenant_id,
    a.id AS asset_id,
    a.serial_number,
    row_number() OVER (PARTITION BY a.tenant_id ORDER BY a.created_at, a.id) AS rn
  FROM assets a
  WHERE a.status = 'assigned'
),
seed_creators AS (
  SELECT DISTINCT ON (u.tenant_id) u.tenant_id, u.id AS created_by
  FROM users u
  WHERE u.role IN ('admin', 'it_staff')
  ORDER BY u.tenant_id, CASE u.role WHEN 'admin' THEN 0 ELSE 1 END, u.created_at
)
INSERT INTO asset_assignments (tenant_id, asset_id, user_id, assigned_date, expected_return_date, returned_date, condition_notes, created_by)
SELECT
  st.tenant_id,
  st.asset_id,
  a.id,
  now() - ((st.rn % 40) * interval '1 day'),
  (current_date + ((st.rn % 20) + 7) * interval '1 day')::date,
  CASE WHEN st.rn % 5 = 0 THEN now() - ((st.rn % 10) * interval '1 day') ELSE NULL END,
  'Assigned during seed generation',
  c.created_by
FROM seed_targets st
JOIN assignees a
  ON a.tenant_id = st.tenant_id
 AND a.rn = ((st.rn - 1) % GREATEST((SELECT count(*) FROM assignees x WHERE x.tenant_id = st.tenant_id), 1)) + 1
JOIN seed_creators c ON c.tenant_id = st.tenant_id
WHERE NOT EXISTS (
  SELECT 1 FROM asset_assignments aa WHERE aa.tenant_id = st.tenant_id AND aa.asset_id = st.asset_id
);

WITH req_users AS (
  SELECT
    u.tenant_id,
    u.id,
    u.role,
    row_number() OVER (PARTITION BY u.tenant_id, u.role ORDER BY u.created_at, u.id) AS rn
  FROM users u
),
request_seed AS (
  SELECT t.id AS tenant_id, gs.n
  FROM tenants t
  CROSS JOIN generate_series(1, 8) gs(n)
)
INSERT INTO asset_requests (tenant_id, requested_by, requested_for, asset_type, justification, status, approved_by, approved_at, fulfilled_at, created_at)
SELECT
  rs.tenant_id,
  COALESCE(emp.id, mgr.id, adminu.id) AS requested_by,
  COALESCE(emp.id, mgr.id, adminu.id) AS requested_for,
  CASE (rs.n % 4)
    WHEN 0 THEN 'laptop'
    WHEN 1 THEN 'monitor'
    WHEN 2 THEN 'dock'
    ELSE 'phone'
  END,
  'Need equipment for onboarding and replacement cycle #' || rs.n,
  CASE
    WHEN rs.n IN (1, 2, 3) THEN 'pending'
    WHEN rs.n IN (4, 5) THEN 'approved'
    WHEN rs.n IN (6, 7) THEN 'fulfilled'
    ELSE 'rejected'
  END,
  CASE WHEN rs.n >= 4 THEN COALESCE(it.id, adminu.id) ELSE NULL END,
  CASE WHEN rs.n >= 4 THEN now() - ((10 - rs.n) * interval '1 day') ELSE NULL END,
  CASE WHEN rs.n IN (6, 7) THEN now() - ((8 - rs.n) * interval '1 day') ELSE NULL END,
  now() - ((20 - rs.n) * interval '1 day')
FROM request_seed rs
LEFT JOIN req_users emp ON emp.tenant_id = rs.tenant_id AND emp.role = 'employee' AND emp.rn = 1
LEFT JOIN req_users mgr ON mgr.tenant_id = rs.tenant_id AND mgr.role = 'manager' AND mgr.rn = 1
LEFT JOIN req_users it ON it.tenant_id = rs.tenant_id AND it.role = 'it_staff' AND it.rn = 1
LEFT JOIN req_users adminu ON adminu.tenant_id = rs.tenant_id AND adminu.role = 'admin' AND adminu.rn = 1
WHERE NOT EXISTS (
  SELECT 1
  FROM asset_requests r
  WHERE r.tenant_id = rs.tenant_id
    AND r.justification = 'Need equipment for onboarding and replacement cycle #' || rs.n
);

INSERT INTO audit_logs (tenant_id, entity_type, entity_id, action, changed_by, changes, ip_address, timestamp)
SELECT
  a.tenant_id,
  'asset',
  a.id,
  'seed_update',
  u.id,
  jsonb_build_object('status', a.status, 'serial_number', a.serial_number),
  '127.0.0.1',
  now() - ((row_number() OVER (PARTITION BY a.tenant_id ORDER BY a.created_at, a.id)) * interval '2 hour')
FROM assets a
JOIN LATERAL (
  SELECT uu.id
  FROM users uu
  WHERE uu.tenant_id = a.tenant_id
  ORDER BY CASE uu.role WHEN 'admin' THEN 0 WHEN 'it_staff' THEN 1 ELSE 2 END, uu.created_at
  LIMIT 1
) u ON true
WHERE NOT EXISTS (
  SELECT 1 FROM audit_logs l
  WHERE l.tenant_id = a.tenant_id
    AND l.entity_type = 'asset'
    AND l.entity_id = a.id
    AND l.action = 'seed_update'
);
