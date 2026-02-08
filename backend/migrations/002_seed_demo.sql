INSERT INTO tenants (id, name, subdomain, plan_type, settings)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Demo Corp', 'demo', 'starter', '{"timezone":"UTC","currency":"USD"}')
ON CONFLICT (subdomain) DO NOTHING;

INSERT INTO users (id, tenant_id, email, password_hash, role, first_name, last_name, department)
VALUES
  ('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 'admin@demo.com', '$2a$10$1RQzEJfPo0f0me4RXTmQYOEU8Of81faIagfNWMf1Q6.9JVVJv6xQi', 'admin', 'Demo', 'Admin', 'IT'),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'employee@demo.com', '$2a$10$1RQzEJfPo0f0me4RXTmQYOEU8Of81faIagfNWMf1Q6.9JVVJv6xQi', 'employee', 'End', 'User', 'Engineering')
ON CONFLICT (email) DO NOTHING;

INSERT INTO assets (id, tenant_id, asset_type, brand, model, serial_number, purchase_date, purchase_price, warranty_expiry, status, location, notes)
VALUES
  ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', 'laptop', 'Lenovo', 'ThinkPad T14', 'SN-DEMO-001', '2024-01-15', 1249.99, '2027-01-15', 'available', 'HQ', 'Demo device'),
  ('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', 'monitor', 'Dell', 'U2723QE', 'SN-DEMO-002', '2024-03-20', 599.99, '2027-03-20', 'available', 'HQ', 'Demo monitor')
ON CONFLICT (tenant_id, serial_number) DO NOTHING;
