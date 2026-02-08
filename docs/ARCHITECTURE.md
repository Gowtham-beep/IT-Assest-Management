# Architecture

## Core Stack
- Frontend: Next.js (App Router), TypeScript, Tailwind CSS
- Backend: Express.js, TypeScript, Zod validation
- Database: PostgreSQL (shared DB multi-tenant with `tenant_id`)
- Cache/Queue: Redis (ready for session + notifications)
- Storage: S3-compatible integration point documented for asset files

## Multi-Tenancy
- Shared database model with strict `tenant_id` on all business tables
- JWT payload includes `tenantId`
- API middleware enforces tenant context before route handlers
- SQL queries scoped with `WHERE tenant_id = $x`

## Lifecycle
- Asset states: `available -> assigned -> in_repair -> available`, and `* -> retired`
- Request states: `pending -> approved/rejected -> fulfilled`
- Audit logs capture before/after change payloads
